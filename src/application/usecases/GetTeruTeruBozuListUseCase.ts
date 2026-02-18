import { ITeruTeruBozuRepository } from '../../domain/repositories/ITeruTeruBozuRepository';
import { IWeatherService } from '../../domain/repositories/IWeatherService';
import { TeruTeruBozu } from '../../domain/models/TeruTeruBozu';

export type TeruTeruBozuResultDto = {
    bozu: TeruTeruBozu;
    actualWeather: string; // 'Sunny', 'Rainy', 'Unknown'
    isSuccess: boolean;
};

// PREF_COORDS moved to domain or config ideally, but keeping simple for now
const PREF_COORDS: Record<string, { lat: number; lon: number }> = {
    '東京都': { lat: 35.6895, lon: 139.6917 },
    '大阪府': { lat: 34.6937, lon: 135.5023 },
    '北海道': { lat: 43.0642, lon: 141.3469 },
    '沖縄県': { lat: 26.2124, lon: 127.6809 },
    // Simplified fallback
};

export class GetTeruTeruBozuListUseCase {
    constructor(
        private repository: ITeruTeruBozuRepository,
        private weatherService: IWeatherService
    ) { }

    async execute(limit: number = 10): Promise<TeruTeruBozuResultDto[]> {
        // 1. Fetch latest dolls
        const dolls = await this.repository.findLatest(limit);

        // 2. Fetch weather and determine success for each
        const results = await Promise.all(dolls.map(async (bozu) => {
            const coords = PREF_COORDS[bozu.prefecture] || PREF_COORDS['東京都'];

            // Ideally this should be cached (Repository or Service could handle caching)
            // For now, simpler to call service. Service implementation could cache.
            const weatherCode = await this.weatherService.getWeatherCode(
                coords.lat,
                coords.lon,
                bozu.date
            );

            const isSuccess = bozu.isWishFulfilled(weatherCode);

            let weatherStr = '取得失敗';
            if (weatherCode !== null) {
                if (weatherCode >= 51) weatherStr = '雨/雪';
                else weatherStr = '晴れ/曇り';
            }

            return {
                bozu,
                actualWeather: weatherStr,
                isSuccess
            };
        }));

        return results;
    }
}
