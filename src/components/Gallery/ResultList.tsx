'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './ResultList.module.css';

type Doll = {
    id: number;
    date: string;
    memo: string;
    type: 'normal' | 'sakasa';
    prefecture?: string;
};

// Simplified mapping for MVP. In reality, we'd need lat/lon for each prefecture.
// Using Tokyo coordinates as default fallback.
const PREF_COORDS: Record<string, { lat: number; lon: number }> = {
    '東京都': { lat: 35.6895, lon: 139.6917 },
    '大阪府': { lat: 34.6937, lon: 135.5023 },
    '北海道': { lat: 43.0642, lon: 141.3469 },
    '沖縄県': { lat: 26.2124, lon: 127.6809 },
    // Add more reliable defaults or use a geocoding API later
};

export default function ResultList() {
    const [results, setResults] = useState<(Doll & { actualWeather?: string; isSuccess?: boolean })[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const today = new Date().toISOString().split('T')[0];
            const { data } = await supabase
                .from('dolls')
                .select('*')
                .lt('date', today) // Past dates only
                .order('date', { ascending: false })
                .limit(10);

            if (data) {
                const outcomes = await Promise.all(data.map(async (doll) => {
                    const pref = doll.prefecture || '東京都'; // Default to Tokyo if missing
                    const coords = PREF_COORDS[pref] || PREF_COORDS['東京都'];
                    const cacheKey = `weather_${pref}_${doll.date}`;

                    try {
                        let weatherCode = null;

                        // 1. Try to get from Cache
                        const cached = localStorage.getItem(cacheKey);
                        if (cached) {
                            weatherCode = parseInt(cached, 10);
                        } else {
                            // 2. Fetch from API if not cached
                            const res = await fetch(
                                `https://archive-api.open-meteo.com/v1/archive?latitude=${coords.lat}&longitude=${coords.lon}&start_date=${doll.date}&end_date=${doll.date}&daily=weather_code&timezone=Asia%2FTokyo`
                            );
                            const weatherData = await res.json();
                            weatherCode = weatherData.daily?.weather_code?.[0];

                            // 3. Save to Cache (only if valid)
                            if (weatherCode !== undefined && weatherCode !== null) {
                                localStorage.setItem(cacheKey, weatherCode.toString());
                            }
                        }

                        // WMO Weather Codes: 0-3 = Clear/Cloudy, 51+ = Rain/Drizzle/Snow
                        // https://open-meteo.com/en/docs
                        let isRainy = false;
                        let weatherStr = '晴れ/曇り';

                        if (weatherCode !== null) {
                            if (weatherCode >= 51) {
                                isRainy = true;
                                weatherStr = '雨/雪';
                            }
                        } else {
                            weatherStr = '取得失敗';
                        }

                        // Success logic:
                        // Normal (Sunny wish) -> Success if NOT rainy
                        // Sakasa (Rain wish) -> Success if rainy
                        const isSuccess = doll.type === 'normal' ? !isRainy : isRainy;

                        return { ...doll, actualWeather: weatherStr, isSuccess };

                    } catch (e) {
                        console.error('Weather fetch error', e);
                        return { ...doll, actualWeather: '取得失敗', isSuccess: false };
                    }
                }));
                setResults(outcomes);
            }
        };

        fetchHistory();
    }, []);

    // if (results.length === 0) return null; // removed to show title even if empty

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>過去の願いの結果</h2>
            {results.length === 0 ? (
                <p className={styles.empty}>まだ過去の記録はありません。</p>
            ) : (
                <div className={styles.list}>
                    {results.map((item) => (
                        <div key={item.id} className={`${styles.card} ${item.isSuccess ? styles.success : styles.fail}`}>
                            <div className={styles.date}>{item.date} ({item.prefecture || '東京都'})</div>
                            <div className={styles.memo}>{item.memo}</div>
                            <div className={styles.outcome}>
                                願い: {item.type === 'normal' ? '晴れ' : '雨'} → 結果: {item.actualWeather}
                                <span className={styles.badge}>{item.isSuccess ? '叶った！🎉' : '残念...'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
