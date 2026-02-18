'use client';

import { useEffect } from 'react';
import styles from './ResultList.module.css';
import { useTeruTeruBozu } from '@/hooks/useTeruTeruBozu';

export default function ResultList() {
    const { history, fetchHistory, loading } = useTeruTeruBozu();

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const results = history;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>過去の願いの結果</h2>
            {results.length === 0 ? (
                <p className={styles.empty}>まだ過去の記録はありません。</p>
            ) : (
                <div className={styles.list}>
                    {results.map((item) => (
                        <div key={item.bozu.id} className={`${styles.card} ${item.isSuccess ? styles.success : styles.fail}`}>
                            <div className={styles.date}>{item.bozu.date} ({item.bozu.prefecture || '東京都'})</div>
                            <div className={styles.memo}>{item.bozu.memo}</div>
                            <div className={styles.outcome}>
                                願い: {item.bozu.type === 'normal' ? '晴れ' : '雨'} → 結果: {item.actualWeather}
                                <span className={styles.badge}>{item.isSuccess ? '叶った！🎉' : '残念...'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
