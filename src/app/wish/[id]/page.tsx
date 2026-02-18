import { Metadata } from 'next';
import { SupabaseTeruTeruBozuRepository } from '@/infrastructure/repositories/SupabaseTeruTeruBozuRepository';
import Sky from '@/components/Sky/Sky';
import TeruTeruBozu from '@/components/TeruTeruBozu/TeruTeruBozu';
import Link from 'next/link';
import styles from './page.module.css';
import WishClient from './WishClient';

type Props = {
    params: Promise<{ id: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);

    let title = 'オンラインてるてる坊主';
    let description = '願いを込めて、デジタルてるてる坊主を作りましょう。';
    let ogUrlStr = '';

    if (!isNaN(id)) {
        const repo = new SupabaseTeruTeruBozuRepository();
        const doll = await repo.findById(id);

        if (doll) {
            title = `${doll.date}の天気願い | オンラインてるてる坊主`;
            description = `願い事: ${doll.memo}`;

            // Base URL used in root layout or page
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
                ? process.env.NEXT_PUBLIC_BASE_URL
                : process.env.VERCEL_URL
                    ? `https://${process.env.VERCEL_URL}`
                    : 'http://localhost:3000';

            const ogUrl = new URL(`${baseUrl}/api/og`);
            ogUrl.searchParams.set('date', doll.date);
            ogUrl.searchParams.set('memo', doll.memo);
            ogUrl.searchParams.set('type', doll.type);
            ogUrlStr = ogUrl.toString();
        }
    }

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: ogUrlStr ? [
                {
                    url: ogUrlStr,
                    width: 1200,
                    height: 630,
                },
            ] : [],
        },
    };
}

export default async function WishPage({ params, searchParams }: Props) {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const resolvedSearchParams = await searchParams;
    const isCreated = resolvedSearchParams?.created === 'true';

    if (isNaN(id)) {
        return <div>Invalid ID</div>;
    }

    const repo = new SupabaseTeruTeruBozuRepository();
    const doll = await repo.findById(id);

    if (!doll) {
        return (
            <Sky weather="sunny">
                <main className={styles.main}>
                    <div className={styles.glassPanel}>
                        <h1 className={styles.title}>見つかりませんでした</h1>
                        <p className={styles.message}>このてるてる坊主は存在しないか、削除された可能性があります。</p>
                        <Link href="/" className={styles.actionButton}>
                            トップページへ戻る
                        </Link>
                    </div>
                </main>
            </Sky>
        );
    }

    return (
        <Sky weather={doll.type === 'sakasa' ? 'rainy' : 'sunny'}>
            <main className={styles.main}>
                <div className={styles.glassPanel}>
                    <h1 className={styles.title}>
                        {doll.date}の願い
                    </h1>

                    <div className={styles.bozuWrapper}>
                        <TeruTeruBozu
                            date={doll.date}
                            memo={doll.memo}
                            type={doll.type}
                        />
                    </div>

                    <p className={styles.message}>{doll.memo}</p>

                    <WishClient
                        isCreated={isCreated}
                        shareText={`${doll.date}の天気願い`}
                        shareUrl={process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/wish/${id}` : `http://localhost:3000/wish/${id}`}
                    />
                </div>
            </main>
        </Sky>
    );
}
