import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
  reactCompiler: true,
  cacheLife: {
    minutes: {
      stale: 300, // 5分間staleを許可
      revalidate: 300, // 5分間キャッシュ
      expire: 600, // 10分で期限切れ
    },
  },
};

export default nextConfig;
