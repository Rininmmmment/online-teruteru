import { ITeruTeruBozuRepository } from '../../domain/repositories/ITeruTeruBozuRepository';
import { TeruTeruBozu, TeruTeruBozuType } from '../../domain/models/TeruTeruBozu';
import { supabase } from '@/lib/supabase';

export class SupabaseTeruTeruBozuRepository implements ITeruTeruBozuRepository {
    async save(bozu: TeruTeruBozu): Promise<TeruTeruBozu> {
        const { data, error } = await supabase
            .from('dolls')
            .insert([
                {
                    date: bozu.date,
                    memo: bozu.memo,
                    type: bozu.type,
                    prefecture: bozu.prefecture
                },
            ])
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to save doll: ${error.message}`);
        }

        return new TeruTeruBozu(
            data.id,
            data.date,
            data.memo,
            data.type as TeruTeruBozuType,
            data.prefecture,
            'smile' // Default face
        );
    }

    async findLatest(limit: number): Promise<TeruTeruBozu[]> {
        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('dolls')
            .select('*')
            .lt('date', today) // Past dates only
            .order('date', { ascending: false })
            .limit(limit);

        if (error) {
            throw new Error(`Failed to fetch dolls: ${error.message}`);
        }

        return (data || []).map(d => new TeruTeruBozu(
            d.id,
            d.date,
            d.memo,
            d.type as TeruTeruBozuType,
            d.prefecture,
            'smile'
        ));
    }

    async findById(id: number): Promise<TeruTeruBozu | null> {
        const { data, error } = await supabase
            .from('dolls')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return null;
        }

        return new TeruTeruBozu(
            data.id,
            data.date,
            data.memo,
            data.type as TeruTeruBozuType,
            data.prefecture,
            'smile'
        );
    }
}
