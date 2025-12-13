'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { styled } from '../../../styled-system/jsx';
import type { Cats } from '../api/cats-api';
import { useCatsInfinite } from '../hooks/use-cats-infinite';
import imagekitLoader from '../../../lib/imagekit-loader';

// #region agent log
const debugLog = (location: string, message: string, data: Record<string, unknown>, hypothesisId: string) => {
  fetch('http://127.0.0.1:7242/ingest/ea7c6cb7-a69b-438e-8bb4-29e528f4a49a', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location, message, data, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId })
  }).catch(() => {});
};
// #endregion

type Props = {
  initialCats: Cats;
};

const GridContainer = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gridAutoRows: 'calc(100vw / 5)',
    gap: '2px',
    lgDown: {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridAutoRows: 'calc(100vw / 3)',
    },
    mdDown: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridAutoRows: 'calc(100vw / 2)',
    },
    smDown: {
      gridTemplateColumns: 'repeat(1, 1fr)',
      gridAutoRows: 'calc(100vw)',
    },
  },
});

const Sentinel = styled('div', {
  base: {
    height: '1px',
    width: '100%',
  },
});

export function CatGallery({ initialCats }: Props) {
  // フック内でシャッフルとデータ管理を行う
  const { data, loadMore, hasMore } = useCatsInfinite(initialCats);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // #region agent log
  useEffect(() => {
    debugLog('cat-gallery.tsx:CatGallery', 'Client hydration complete', { initialCatsCount: initialCats.length, dataCount: data.length }, 'A');
  }, []);
  // #endregion

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: '100px', // 100px手前で読み込み開始
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [loadMore, hasMore]);

  return (
    <main>
      <GridContainer>
        {data.map((cat, index) => {
          // 最初のビューポートに表示される画像のみ eager で読み込む
          // デスクトップ: 5列 × 2行 = 10枚（Logo.pngがLCP要素なので猫画像の優先度を下げる）
          const isAboveFold = index < 10;
          return (
            <Image
              key={cat.id}
              src={cat.url}
              loader={imagekitLoader}
              alt=""
              width={500}
              height={500}
              loading={isAboveFold ? "eager" : "lazy"}
              fetchPriority={index < 5 ? "high" : undefined}
              style={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
            />
          );
        })}
      </GridContainer>
      {hasMore && <Sentinel ref={sentinelRef} />}
    </main>
  );
}
