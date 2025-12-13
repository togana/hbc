'use client';

import { forwardRef, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import { VirtuosoGrid } from 'react-virtuoso';
import type { Cats } from '../../api/external/cats';
import { useCatsInfinite } from '../../hooks/use-cats-infinite';
import imagekitLoader from '../../lib/imagekit-loader';

type Props = {
  initialCats: Cats;
};

const ListElement = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: calc(100vw / 5);
  gap: 2px;

  ${({ theme }) => theme.breakpoints.down('lg')} {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: calc(100vw / 3);
  }

  ${({ theme }) => theme.breakpoints.down('md')} {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: calc(100vw / 2);
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    grid-template-columns: repeat(1, 1fr);
    grid-auto-rows: calc(100vw);
  }
`;

const ListContainer = forwardRef<HTMLDivElement>((props, ref) => {
  return <ListElement {...props} ref={ref} />;
});
ListContainer.displayName = 'List';

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
`;

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
