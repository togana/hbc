import type { Metadata } from 'next';
import '../styled-system/styles.css';

export const metadata: Metadata = {
  title: 'Healing by cat',
  description: 'Healing by cat',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          rel="preconnect"
          href="https://ik.imagekit.io"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
