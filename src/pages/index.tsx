import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styled from '@emotion/styled';
import { down } from 'styled-breakpoints';
import { search } from '../api/external/cats';
import type { Cats } from '../api/external/cats';
import { useCatsInfinite } from '../hooks/useCatsInfinite';
import imagekitLoader from '../lib/imagekitLoader';

type Props = {
  cats: Cats;
};

const ImageContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: calc(100vw / 5);
  gap: 2px;

  ${down('md')} {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: calc(100vw / 3);
  }

  ${down('sm')} {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: calc(100vw / 2);
  }

  ${down('xs')} {
    grid-template-columns: repeat(1, 1fr);
    grid-auto-rows: calc(100vw);
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const getScrollBottom = () => {
  const body = window.document.body;
  const html = window.document.documentElement;
  const scrollTop = body.scrollTop || html.scrollTop;
  return html.scrollHeight - html.clientHeight - scrollTop;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shuffle = <T extends any[]>([...array]: T): T => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array as T;
}

export default function Home({ cats }: Props): JSX.Element {
  const [list, setList] = useState(shuffle(cats));
  const { data, size, setSize } = useCatsInfinite();

  useEffect(() => {
    let isSend = true;
    const handleScroll = () => {
      if (
        isSend &&
        getScrollBottom() < 3800 &&
        data &&
        typeof data[size - 1] !== 'undefined'
      ) {
        isSend = false;
        setSize((current) => current + 1);
        setList((current) => [...current, ...data[size - 1]]);
      }
    };
    if (data?.length === size) {
      handleScroll();
    }
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data, setSize, size]);

  return (
    <div>
      <Head>
        <title>Healing by cat</title>
      </Head>

      <Header>
        <Image src="/Logo.png" alt="logo" width="540" height="283" />
      </Header>
      <main>
        <ImageContainer>
          {list.map((cat) => (
            <Image
              key={cat.id}
              src={cat.url}
              loader={imagekitLoader}
              alt=""
              width="500"
              height="500"
              objectFit="cover"
              loading="eager"
            />
          ))}
        </ImageContainer>
      </main>
    </div>
  );
}

export async function getStaticProps(): Promise<{
  props: Props;
  revalidate: number;
}> {
  const catsResponses = await Promise.all([...Array(5)].map(() => search({
    order: 'random',
  })));

  return {
    props: {
      cats: catsResponses.flat(),
    },
    revalidate: 600,
  };
}
