'use client';

import { forwardRef, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { VirtuosoGrid } from 'react-virtuoso';
import { styled } from '../../styled-system/jsx';
import type { Cats } from '../../api/external/cats';
import { useCatsInfinite } from '../../hooks/use-cats-infinite';
import imagekitLoader from '../../lib/imagekit-loader';

type Props = {
  initialCats: Cats;
};

const ListElement = styled('div', {
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

const ListContainer = forwardRef<HTMLDivElement>((props, ref) => {
  return <ListElement {...props} ref={ref} />;
});
ListContainer.displayName = 'List';

const shuffle = <T extends Cats>([...array]: T): T => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array as T;
};

export function CatGallery({ initialCats }: Props) {
  const [list, setList] = useState(initialCats);
  const { data, size, setSize } = useCatsInfinite();

  // クライアント側でのみシャッフルを実行してHydrationエラーを防ぐ
  useEffect(() => {
    setTimeout(() => {
      setList(shuffle([...initialCats]));
    }, 0);
  }, [initialCats]);

  useEffect(() => {
    const handleScroll = () => {
      if (data && typeof data[size - 1] !== 'undefined') {
        setList((current) => [...current, ...data[size - 1]]);
      }
    };
    handleScroll();
  }, [data, size]);

  const loadMore = useCallback(() => {
    setSize((current) => current + 1);
  }, [setSize]);

  return (
    <div>
      <Header>
        <Image src="/Logo.png" alt="logo" priority width="540" height="283" />
      </Header>
      <main>
        <VirtuosoGrid
          overscan={2500}
          totalCount={list.length}
          components={{
            List: ListContainer,
          }}
          useWindowScroll={true}
          itemContent={(index) => (
            <Image
              key={list[index].id}
              src={list[index].url}
              loader={imagekitLoader}
              alt=""
              unoptimized
              width="500"
              height="500"
              loading="eager"
              style={{
                maxHeight: '100%',
                objectFit: 'cover',
              }}
            />
          )}
          endReached={loadMore}
        />
      </main>
    </div>
  );
}
