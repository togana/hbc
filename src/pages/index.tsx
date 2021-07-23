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

export default function Home({ cats }: Props): JSX.Element {
  const { data, setSize } = useCatsInfinite();

  return (
    <div>
      <Head>
        <title>Healing by cat</title>
      </Head>

      <Header>
        <Image src="/Logo.png" alt="logo" width="540" height="283" />
      </Header>
      <button onClick={() => setSize((size) => size + 1)}>Load More</button>
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
                loading="eager"
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
