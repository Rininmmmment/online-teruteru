'use client';

import Sky from '@/components/Sky/Sky';
import Link from 'next/link';
import FloatingDolls from '@/components/Sky/FloatingDolls';
import styles from './page.module.css';
import { useState } from 'react';
import PrefectureModal from '@/components/Interface/PrefectureModal';

export default function GalleryPage() {
    const [filterPref, setFilterPref] = useState('');
    const [isPrefModalOpen, setIsPrefModalOpen] = useState(false);

    return (
        <Sky weather="sunny">
            <FloatingDolls prefecture={filterPref} />
            <main className={styles.main}>
                <div className={styles.header}>
                    <Link href="/" className={styles.backButton}>← 戻る</Link>
                    <h1 className={styles.title}>みんなの願い</h1>
                </div>

                <div className={styles.filterContainer}>
                    <label>場所で絞り込む：</label>
                    <div
                        className={styles.prefSelect}
                        onClick={() => setIsPrefModalOpen(true)}
                    >
                        {filterPref || 'すべて（全国）'}
                    </div>
                    <PrefectureModal
                        isOpen={isPrefModalOpen}
                        onClose={() => setIsPrefModalOpen(false)}
                        onSelect={setFilterPref}
                    />
                </div>

                {/* Only Floating Dolls visuals requested */}
            </main>
        </Sky>
    );
}
