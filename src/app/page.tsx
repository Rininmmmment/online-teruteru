import HomeClient from '@/components/HomeClient';
import { Metadata } from 'next';
import { SupabaseTeruTeruBozuRepository } from '@/infrastructure/repositories/SupabaseTeruTeruBozuRepository';
import { getBaseUrl } from '@/lib/utils';

type Props = {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const params = await searchParams;
  const idStr = params.id;

  let date = params.date || '';
  let memo = params.memo || '';
  let type = params.type || 'normal';

  // If ID is present, fetch from DB to ensure data integrity for sharing
  if (idStr) {
    const id = parseInt(idStr as string, 10);
    if (!isNaN(id)) {
      const repo = new SupabaseTeruTeruBozuRepository();
      const doll = await repo.findById(id);
      if (doll) {
        date = doll.date;
        memo = doll.memo;
        type = doll.type;
      }
    }
  }

  // Base URL calculation (needs to be absolute for OG)
  const baseUrl = getBaseUrl();

  const ogUrl = new URL(`${baseUrl}/api/og`);
  if (date) ogUrl.searchParams.set('date', date as string);
  if (memo) ogUrl.searchParams.set('memo', memo as string);
  if (type) ogUrl.searchParams.set('type', type as string as string);

  const title = date
    ? `${date}の天気願い | オンラインてるてる坊主`
    : 'オンラインてるてる坊主';

  return {
    title: title,
    description: '願いを込めて、デジタルてるてる坊主を作りましょう。',
    openGraph: {
      title: title,
      description: memo ? `願い事: ${memo}` : '願いを込めて、デジタルてるてる坊主を作りましょう。',
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'オンラインてるてる坊主',
    applicationCategory: 'EntertainmentApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
    description: 'オンラインでてるてる坊主を作って、天気への願いを込めるWebアプリケーション。みんなの願いを共有しよう。',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '100', // Mock data for SEO hook
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
