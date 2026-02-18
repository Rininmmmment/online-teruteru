import { IWeatherService } from '../../domain/repositories/IWeatherService';

export class OpenMeteoWeatherService implements IWeatherService {
    async getWeatherCode(lat: number, lon: number, date: string): Promise<number | null> {
        try {
            const res = await fetch(
                `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${date}&end_date=${date}&daily=weather_code&timezone=Asia%2FTokyo`
            );

            if (!res.ok) {
                console.error('Weather API error:', res.statusText);
                return null;
            }

            const data = await res.json();
            const code = data.daily?.weather_code?.[0];

            return code !== undefined ? code : null;
        } catch (error) {
            console.error('Failed to fetch weather:', error);
            return null;
        }
    }
}
