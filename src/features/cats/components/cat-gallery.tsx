'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { styled } from '../../../styled-system/jsx';
import type { Cats } from '../api/cats-api';
import { useCatsInfinite } from '../hooks/use-cats-infinite';
import imagekitLoader from '../../../lib/imagekit-loader';

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

const Header = styled('header', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    <div>
      <Header>
        <Image
          src="/Logo.png"
          alt="logo"
          fetchPriority="high"
          width="540"
          height="283"
        />
      </Header>
      <main>
        <GridContainer>
          {data.map((cat, index) => {
            // 最初のビューポートに表示される画像のみ eager で読み込む
            // デスクトップ: 5列 × 3行 = 15枚、モバイル: 1列 × 5行 = 5枚を考慮して15枚まで
            const isAboveFold = index < 15;
            // LCP要素になる可能性が高い最初の1枚に preload と fetchPriority="high" を設定
            const isLCPCandidate = index === 0;
            return (
              <Image
                key={cat.id}
                src={cat.url}
                loader={imagekitLoader}
                alt=""
                width="500"
                height="500"
                loading={isAboveFold ? "eager" : "lazy"}
                preload={isLCPCandidate}
                fetchPriority={isLCPCandidate ? "high" : undefined}
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
    </div>
  );
}
