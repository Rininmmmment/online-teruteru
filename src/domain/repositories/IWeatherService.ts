export interface IWeatherService {
    getWeatherCode(lat: number, lon: number, date: string): Promise<number | null>;
}
