'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sky from '@/components/Sky/Sky';
import Link from 'next/link';
import TeruTeruBozu from '@/components/TeruTeruBozu/TeruTeruBozu';
import CreatorForm from '@/components/Interface/CreatorForm';
import ResultList from '@/components/Gallery/ResultList';
import styles from '@/app/page.module.css';

function HomeContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const dateParam = searchParams.get('date');
    const memoParam = searchParams.get('memo');
    const typeParam = searchParams.get('type') as 'normal' | 'sakasa' | null;

    const handleCreate = (data: { date: string; memo: string; type: 'normal' | 'sakasa' }) => {
        const params = new URLSearchParams();
        if (data.date) params.set('date', data.date);
        if (data.memo) params.set('memo', data.memo);
        if (data.type) params.set('type', data.type);

        router.push(`/?${params.toString()}`);
    };

    const handleShare = () => {
        const text = `てるてる坊主を作りました！\n希望日: ${dateParam}\n名前: ${memoParam || '名無し'}`;
        const shareUrl = window.location.href;
        // Add a newline before the URL to ensure it separates clearly
        const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text + '\n' + shareUrl)}`;
        window.open(lineUrl, '_blank');
    };

    const hasContent = !!(dateParam || memoParam || typeParam);

    return (
        <Sky weather={typeParam === 'sakasa' ? 'rainy' : 'sunny'}>
            <main className={styles.main}>

                {hasContent ? (
                    <div className={styles.glassPanel}>
                        <h1 className={styles.title}>
                            {dateParam ? `${dateParam}の天気願い` : 'てるてる坊主'}
                        </h1>
                        <div className={styles.bozuWrapper}>
                            <TeruTeruBozu
                                date={dateParam || undefined}
                                memo={memoParam || undefined}
                                type={typeParam || 'normal'}
                            />
                        </div>

                        <div className={styles.actions}>
                            <button onClick={handleShare} className={styles.shareButton}>
                                LINEで共有する
                            </button>
                            <button onClick={() => router.push('/')} className={styles.secondaryButton}>
                                新しく作る
                            </button>
                        </div>

                        <Link href="/gallery" className={styles.galleryLink}>
                            みんなの願いを見る
                        </Link>
                    </div>
                ) : (
                    <div className={styles.creator}>
                        <h1 className={styles.title}>オンラインてるてる坊主</h1>
                        <CreatorForm onCreate={handleCreate} />

                        <Link href="/gallery" className={styles.galleryLink}>
                            みんなの願いを見る
                        </Link>
                    </div>
                )}

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
