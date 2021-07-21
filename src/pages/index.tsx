import Head from 'next/head';
import Image from 'next/image';
import styled from '@emotion/styled';
import { search } from '../api/cat';
import type { cats } from '../api/cat';

type props = {
  cats: cats;
};

const ImageContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2px;
`;

export default function Home({ cats }: props): JSX.Element {
  return (
    <div>
      <Head>
        <title>Healing by cat</title>
      </Head>

      <main>
        <ImageContainer>
          {cats.map((cat) => (
            <Image
              key={cat.id}
              src={cat.url}
              alt=""
              width="500"
              height="500"
              objectFit="cover"
            />
          ))}
        </ImageContainer>
      </main>
    </div>
  );
}

export async function getStaticProps(): Promise<{
  props: props;
  revalidate: number;
}> {
  const cats = await search({
    order: 'random',
  });

  return {
    props: {
      cats,
    },
    revalidate: 1,
  };
}
