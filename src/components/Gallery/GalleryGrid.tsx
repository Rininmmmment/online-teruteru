'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import TeruTeruBozu from '@/components/TeruTeruBozu/TeruTeruBozu';
import styles from './GalleryGrid.module.css';

type Doll = {
    id: number;
    date: string;
    memo: string;
    type: 'normal' | 'sakasa';
};

export default function GalleryGrid() {
    const [dolls, setDolls] = useState<Doll[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDolls = async () => {
            const { data, error } = await supabase
                .from('dolls')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching dolls:', error);
            } else {
                setDolls(data as Doll[]);
            }
            setLoading(false);
        };

        fetchDolls();
    }, []);

    if (loading) {
        return <div className={styles.loading}>読み込み中...</div>;
    }

    return (
        <div className={styles.grid}>
            {dolls.map((doll) => (
                <div key={doll.id} className={styles.card}>
                    <div className={styles.dollWrapper}>
                        <TeruTeruBozu date={doll.date} memo={doll.memo} type={doll.type} />
                    </div>
                </div>
            ))}
        </div>
    );
}
