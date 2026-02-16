import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const zenMaru = Zen_Maru_Gothic({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-zen-maru",
});

export const metadata: Metadata = {
  title: {
    template: '%s | オンラインてるてる坊主',
    default: 'オンラインてるてる坊主 - 天気への願いをデジタルの空へ',
  },
  description: "「明日晴れてほしい」「雨が降ってほしい」そんな願いを込めて、オンラインでてるてる坊主を作って飛ばそう。みんなの願いが集まるデジタルな空。",
  keywords: ["てるてる坊主", "天気", "願い", "おまじない", "晴れ祈願", "雨乞い", "オンライン", "アプリ"],
  authors: [{ name: "Online Teru Teru Team" }],
  creator: "Online Teru Teru Team",
  publisher: "Online Teru Teru Team",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://online-teruteru.vercel.app/",
    siteName: "オンラインてるてる坊主",
    title: "オンラインてるてる坊主",
    description: "デジタルな空に、あなたの願いを。",
  },
  twitter: {
    card: "summary_large_image",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={zenMaru.className}>
        {children}
      </body>
    </html>
  );
}
