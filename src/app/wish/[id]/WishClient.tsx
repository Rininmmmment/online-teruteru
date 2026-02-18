'use client';

import styles from './page.module.css';
import Link from 'next/link';

type Props = {
    isCreated: boolean;
    shareText: string;
    shareUrl: string;
}

export default function WishClient({ isCreated, shareText, shareUrl }: Props) {
    // Hydration check to ensure window usage is safe if needed, though we passed URL from server
    const handleShare = () => {
        const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(shareText + '\n' + shareUrl)}`;
        window.open(lineUrl, '_blank');
    };

    if (isCreated) {
        return (
            <div className={styles.actions}>
                <button onClick={handleShare} className={styles.shareButton}>
                    LINEで共有する
                </button>
                <Link href="/" className={styles.secondaryButton}>
                    トップページへ戻る
                </Link>
                <Link href="/gallery" className={styles.secondaryButton}>
                    みんなの願いを見る
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.actions}>
            <Link href="/" className={styles.actionButton}>
                自分も作る！
            </Link>
            <Link href="/gallery" className={styles.secondaryButton}>
                みんなの願いを見る
            </Link>
        </div>
    );
}
