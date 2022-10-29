import { forwardRef, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styled from '@emotion/styled';
import { down } from 'styled-breakpoints';
import { VirtuosoGrid } from 'react-virtuoso'
import { search } from '../api/external/cats';
import type { Cats } from '../api/external/cats';
import { useCatsInfinite } from '../hooks/useCatsInfinite';
import imagekitLoader from '../lib/imagekitLoader';

type Props = {
  cats: Cats;
};

const ListElement = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: calc(100vw / 5);
  gap: 2px;

  ${down('lg')} {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: calc(100vw / 3);
  }

  ${down('md')} {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: calc(100vw / 2);
  }

  ${down('sm')} {
    grid-template-columns: repeat(1, 1fr);
    grid-auto-rows: calc(100vw);
  }
`;

const ListContainer = forwardRef<HTMLDivElement>((props, ref) => {
  return <ListElement {...props} ref={ref} />
})
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

export default function Home({ cats }: Props): JSX.Element {
  const [list, setList] = useState(shuffle(cats));
  const { data, size, setSize } = useCatsInfinite();

  useEffect(() => {
    const handleScroll = () => {
      if (
        data &&
        typeof data[size - 1] !== 'undefined'
      ) {
        setList((current) => [...current, ...data[size - 1]]);
      }
    };
    handleScroll();
  }, [data, size]);

  const loadMore = useCallback(() => {
    setSize((current) => current + 1);
  }, [setSize])

  return (
    <div>
      <Head>
        <title>Healing by cat</title>
      </Head>

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
          itemContent={(index) => <Image
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
          }
          endReached={loadMore}
        />
      </main>
    </div>
  );
}

export async function getStaticProps(): Promise<{
  props: Props;
  revalidate: number;
}> {
  const catsResponses = await Promise.all(
    [...Array(5)].map(() =>
      search({
        order: 'random',
      }),
    ),
  );

  return {
    props: {
      cats: catsResponses.flat(),
    },
    revalidate: 600,
  };
}
