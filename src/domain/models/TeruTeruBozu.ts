export type TeruTeruBozuType = 'normal' | 'sakasa';
export type FaceType = 'smile' | 'frown' | 'neutral' | 'none';

export class TeruTeruBozu {
    constructor(
        public readonly id: number,
        public readonly date: string, // YYYY-MM-DD
        public readonly memo: string,
        public readonly type: TeruTeruBozuType,
        public readonly prefecture: string = '東京都',
        public readonly faceType: FaceType = 'smile'
    ) { }

    // Domain Logic: Check if the wish was fulfilled based on weather
    // weatherCode: WMO code
    public isWishFulfilled(weatherCode: number | null): boolean {
        if (weatherCode === null) return false;

        // weatherCode >= 51 means Rain/Drizzle/Snow
        const isRainy = weatherCode >= 51;

        if (this.type === 'normal') {
            // Normal bozu wishes for Sun (Not Rainy)
            return !isRainy;
        } else {
            // Sakasa bozu wishes for Rain
            return isRainy;
        }
    }

    // Factory method to create a new instance (without ID, for creation)
    // In a real DB scenario, ID is assigned by DB. For now we use -1 or handled by repo.
    static create(date: string, memo: string, type: TeruTeruBozuType, prefecture: string): TeruTeruBozu {
        // Basic validation could go here
        return new TeruTeruBozu(-1, date, memo, type, prefecture);
    }
}
