'use client';

import { useState } from 'react';
import styles from './CreatorForm.module.css';
import PrefectureModal from './PrefectureModal';
import CalendarModal from './CalendarModal';

type Props = {
    onCreate: (data: { date: string; memo: string; type: 'normal' | 'sakasa' }) => void;
};

export default function CreatorForm({ onCreate }: Props) {
    const [date, setDate] = useState('');
    const [memo, setMemo] = useState('');
    const [type, setType] = useState<'normal' | 'sakasa'>('normal');
    const [prefecture, setPrefecture] = useState('');
    const [faceType, setFaceType] = useState<'smile' | 'frown' | 'neutral' | 'none'>('smile');
    const [isPrefModalOpen, setIsPrefModalOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Random values for empty fields if needed? 
        // User asked: "未入力の箇所は適当に値入れて"
        // Date is required in UI, but maybe they mean Memo/Name?

        let finalMemo = memo;
        if (!finalMemo) {
            const randomNames = ['てる子', '坊主くん', 'あした天気', '晴れ男', '雨知らず', '太陽さん'];
            finalMemo = randomNames[Math.floor(Math.random() * randomNames.length)];
        }

        if (!date || !prefecture) {
            alert('日付と場所を選んでください！');
            return;
        }

        try {
            // Dynamic import to avoid server-side issues if env vars are missing
            const { supabase } = await import('@/lib/supabase');

            const { error } = await supabase
                .from('dolls')
                .insert([
                    { date, memo: finalMemo, type, prefecture, face_type: faceType }
                ]);

            if (error) {
                console.error('Error saving to Supabase:', error);
            }
        } catch (err) {
            console.error('Supabase client error:', err);
        }

        onCreate({ date, memo: finalMemo, type });
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>

            {/* Required Fields */}
            <div className={styles.field}>
                <label>晴れてほしい日 <span className={styles.required}>*</span></label>
                <div
                    className={styles.dateSelector}
                    onClick={() => setIsCalendarOpen(true)}
                >
                    {date || '日付を選択してください'}
                </div>
                <CalendarModal
                    isOpen={isCalendarOpen}
                    onClose={() => setIsCalendarOpen(false)}
                    onSelect={setDate}
                />
            </div>

            <div className={styles.field}>
                <label>場所（都道府県） <span className={styles.required}>*</span></label>
                <div
                    className={styles.prefSelector}
                    onClick={() => setIsPrefModalOpen(true)}
                >
                    {prefecture || '選択してください'}
                </div>
                <PrefectureModal
                    isOpen={isPrefModalOpen}
                    onClose={() => setIsPrefModalOpen(false)}
                    onSelect={setPrefecture}
                />
            </div>

            {/* Optional Fields (Hidden details) */}
            <details className={styles.details}>
                <summary>細かい設定（名前・顔・種類）</summary>
                <div className={styles.detailsContent}>
                    <div className={styles.field}>
                        <label>名前（ニックネーム）</label>
                        <input
                            type="text"
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            placeholder="例：てる子"
                            maxLength={20}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>顔の表情</label>
                        <div className={styles.radioGroup}>
                            {[
                                { val: 'smile', label: '笑顔' },
                                { val: 'neutral', label: '真顔' },
                                { val: 'frown', label: 'への字' },
                                { val: 'none', label: '顔なし' }
                            ].map((opt) => (
                                <label key={opt.val} className={faceType === opt.val ? styles.active : ''}>
                                    <input
                                        type="radio"
                                        name="faceType"
                                        value={opt.val}
                                        checked={faceType === opt.val}
                                        onChange={() => setFaceType(opt.val as any)}
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>種類</label>
                        <div className={styles.radioGroup}>
                            <label className={type === 'normal' ? styles.active : ''}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="normal"
                                    checked={type === 'normal'}
                                    onChange={() => setType('normal')}
                                />
                                通常（晴れ）
                            </label>
                            <label className={type === 'sakasa' ? styles.active : ''}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="sakasa"
                                    checked={type === 'sakasa'}
                                    onChange={() => setType('sakasa')}
                                />
                                逆さ（雨）
                            </label>
                        </div>
                    </div>
                </div>
            </details>

            <button type="submit" className={styles.button}>
                吊るす
            </button>
        </form>
    );
}
