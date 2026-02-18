import { useState, useCallback, useMemo } from 'react';
import { CreateTeruTeruBozuUseCase } from '@/application/usecases/CreateTeruTeruBozuUseCase';
import { GetTeruTeruBozuUseCase } from '@/application/usecases/GetTeruTeruBozuUseCase';
import { GetTeruTeruBozuListUseCase, TeruTeruBozuResultDto } from '@/application/usecases/GetTeruTeruBozuListUseCase';
import { SupabaseTeruTeruBozuRepository } from '@/infrastructure/repositories/SupabaseTeruTeruBozuRepository';
import { OpenMeteoWeatherService } from '@/infrastructure/services/OpenMeteoWeatherService';
import { TeruTeruBozuType } from '@/domain/models/TeruTeruBozu';

export function useTeruTeruBozu() {
    const [history, setHistory] = useState<TeruTeruBozuResultDto[]>([]);
    const [loading, setLoading] = useState(false);

    // Instantiating dependencies
    // Using useMemo to strictly avoid re-instantiation
    const { createUseCase, getListUseCase, getDollUseCase } = useMemo(() => {
        const repository = new SupabaseTeruTeruBozuRepository();
        const weatherService = new OpenMeteoWeatherService();
        return {
            createUseCase: new CreateTeruTeruBozuUseCase(repository),
            getListUseCase: new GetTeruTeruBozuListUseCase(repository, weatherService),
            getDollUseCase: new GetTeruTeruBozuUseCase(repository)
        };
    }, []);

    const createDoll = useCallback(async (date: string, memo: string, type: TeruTeruBozuType, prefecture: string = '東京都') => {
        try {
            setLoading(true);
            const created = await createUseCase.execute(date, memo, type, prefecture);
            return created;
        } catch (error) {
            console.error('Failed to create doll:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [createUseCase]);

    const getDoll = useCallback(async (id: number) => {
        try {
            setLoading(true);
            return await getDollUseCase.execute(id);
        } catch (error) {
            console.error('Failed to get doll:', error);
            return null;
        } finally {
            setLoading(false);
        }
    }, [getDollUseCase]);

    const fetchHistory = useCallback(async () => {
        try {
            setLoading(true);
            const results = await getListUseCase.execute(10);
            setHistory(results);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    }, [getListUseCase]);

    return {
        history,
        loading,
        createDoll,
        getDoll,
        fetchHistory
    };
}
