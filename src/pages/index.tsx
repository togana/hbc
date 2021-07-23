import { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styled from '@emotion/styled';
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

export default function Home({ cats }: Props): JSX.Element {
  const { data, size, setSize } = useCatsInfinite();

  useEffect(() => {
    let isSend = true;
    const handleScroll = () => {
      if (
        isSend &&
        getScrollBottom() < 1800 &&
        data &&
        typeof data[size - 1] !== 'undefined'
      ) {
        isSend = false;
        setSize(size + 1);
      }
    };
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
          {cats.map((cat) => (
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
          {data?.map((cats) =>
            cats.map((cat) => (
              <Image
                key={cat.id}
                src={cat.url}
                loader={imagekitLoader}
                alt=""
                width="500"
                height="500"
                objectFit="cover"
                loading="lazy"
              />
            )),
          )}
        </ImageContainer>
      </main>
    </div>
  );
}

export async function getStaticProps(): Promise<{
  props: Props;
  revalidate: number;
}> {
  const cats = await search({
    order: 'random',
  });

  return {
    props: {
      cats,
    },
    revalidate: 60,
  };
}
