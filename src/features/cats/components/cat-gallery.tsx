'use client';

import Image from 'next/image';
import { styled } from '../../../styled-system/jsx';
import type { Cats } from '../types';
import { useCatsInfinite } from '../hooks/use-cats-infinite';
import { useInfiniteScroll } from '../../../lib/hooks/use-infinite-scroll';
import imagekitLoader from '../../../lib/imagekit/loader';

type Props = {
  initialCats: Cats;
};

export function CatGallery({ initialCats }: Props) {
  const { data, loadMore, hasMore } = useCatsInfinite(initialCats);
  const sentinelRef = useInfiniteScroll(loadMore, { enabled: hasMore });

  return (
    <main>
      <styled.div
        display="grid"
        gridTemplateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(5, 1fr)',
        }}
        gridAutoRows={{
          base: 'calc(100vw)',
          sm: 'calc(100vw / 2)',
          md: 'calc(100vw / 3)',
          lg: 'calc(100vw / 5)',
        }}
        gap="2px"
      >
        {data.map((cat, index) => {
          // 最初のビューポートに表示される画像のみ eager で読み込む
          // デスクトップ: 5列 × 2行 = 10枚（Logo.pngがLCP要素なので猫画像の優先度を下げる）
          const isAboveFold = index < 10;
          return (
            <Image
              key={cat.id}
              src={cat.url}
              loader={imagekitLoader}
              unoptimized
              alt=""
              width={500}
              height={500}
              loading={isAboveFold ? 'eager' : 'lazy'}
              fetchPriority={index < 5 ? 'high' : undefined}
              style={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
              }}
            />
          );
        })}
      </styled.div>
      {hasMore && <styled.div ref={sentinelRef} height="1px" width="100%" />}
    </main>
  );
}
