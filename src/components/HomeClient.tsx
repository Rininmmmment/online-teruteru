'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Sky from '@/components/Sky/Sky';
import Link from 'next/link';
import CreatorForm from '@/components/Interface/CreatorForm';
import ResultList from '@/components/Gallery/ResultList';
import styles from '@/app/page.module.css';
import { useTeruTeruBozu } from '@/hooks/useTeruTeruBozu';

function HomeContent() {
    const router = useRouter();
    const { createDoll } = useTeruTeruBozu();

    const handleCreate = async (data: { date: string; memo: string; type: 'normal' | 'sakasa' }) => {
        try {
            const newDoll = await createDoll(data.date, data.memo, data.type);
            // Redirect to dedicated share/view page with created flag
            router.push(`/wish/${newDoll.id}?created=true`);
        } catch (e) {
            console.error('Failed to save doll', e);
            alert('保存に失敗しました。もう一度お試しください。');
        }
    };

    return (
        <Sky weather="sunny">
            <main className={styles.main}>
                <div className={styles.creator}>
                    <h1 className={styles.title}>オンラインてるてる坊主</h1>
                    <CreatorForm onCreate={handleCreate} />

                    <Link href="/gallery" className={styles.galleryLink}>
                        みんなのてるてる坊主を見る
                    </Link>
                </div>

                <ResultList />
            </main>
        </Sky>
    );
}

export default function HomeClient() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HomeContent />
        </Suspense>
    );
}
