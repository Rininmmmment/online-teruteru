import HomeClient from '@/components/HomeClient';
import { Metadata } from 'next';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const params = await searchParams;
  const date = params.date || '';
  const memo = params.memo || '';
  const type = params.type || 'normal';

  // Base URL calculation (needs to be absolute for OG)
  // In dev: localhost:3000, In prod: actual URL
  // We can use process.env.NEXT_PUBLIC_BASE_URL if set, or generic fallback
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const ogUrl = new URL(`${baseUrl}/api/og`);
  if (date) ogUrl.searchParams.set('date', date as string);
  if (memo) ogUrl.searchParams.set('memo', memo as string);
  if (type) ogUrl.searchParams.set('type', type as string);

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
  return <HomeClient />;
}
