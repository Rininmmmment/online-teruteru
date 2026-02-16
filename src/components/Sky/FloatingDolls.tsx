'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import TeruTeruBozu from '@/components/TeruTeruBozu/TeruTeruBozu';
import styles from './FloatingDolls.module.css';

type Doll = {
    id: number;
    date: string;
    memo: string;
    type: 'normal' | 'sakasa';
    face_type?: 'smile' | 'frown' | 'neutral' | 'none';
    style?: {
        top: string;
        left: string;
        delay: string;
        scale: string;
    };
};

type Props = {
    prefecture?: string;
};

export default function FloatingDolls({ prefecture }: Props) {
    const [dolls, setDolls] = useState<Doll[]>([]);

    useEffect(() => {
        const fetchDolls = async () => {
            let query = supabase
                .from('dolls')
                .select('*')
                .gte('date', new Date().toISOString().split('T')[0]) // Only future or today
                .order('created_at', { ascending: false })
                .limit(30);

            if (prefecture) {
                query = query.eq('prefecture', prefecture);
            }

            const { data } = await query;

            if (data) {
                const dollsWithStyle = data.map((d: any) => ({
                    ...d,
                    style: {
                        // Removed random top/left
                        delay: `${Math.random() * 2}s`, // Short random delay for sway offset
                        scale: `scale(${0.9 + Math.random() * 0.1})` // Very subtle variation
                    }
                }));
                setDolls(dollsWithStyle as Doll[]);
            }
        };


        fetchDolls();

        // Real-time subscription could be added here
    }, [prefecture]);

    return (
        <div className={styles.container}>
            {dolls.map((doll, index) => (
                <div
                    key={doll.id}
                    className={styles.floatingDoll}
                    style={{
                        animationDelay: doll.style?.delay,
                    }}
                >
                    <div style={{ transform: doll.style?.scale }}>
                        <TeruTeruBozu
                            date={doll.date}
                            memo={doll.memo}
                            type={doll.type}
                            faceType={doll.face_type || 'smile'}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
