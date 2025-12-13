import { cacheLife } from 'next/cache';
import Image from 'next/image';
import { styled } from '../styled-system/jsx';
import { search, type Cats } from '../features/cats/api/cats-api';
import { CatGallery } from '../features/cats/components/cat-gallery';

const shuffle = <T extends Cats>([...array]: T): T => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array as T;
};

async function getInitialCats() {
  'use cache';
  cacheLife('minutes');

  const catsResponses = await Promise.all(
    [...Array(5)].map(() =>
      search({
        order: 'random',
      }),
    ),
  );

  // サーバーサイドでシャッフル（キャッシュされるので一貫性が保たれる）
  return shuffle(catsResponses.flat());
}

export default async function Home() {
  const cats = await getInitialCats();

  return (
    <div>
      <styled.header display="flex" alignItems="center" justifyContent="center">
        <Image
          src="/Logo.png"
          alt="logo"
          fetchPriority="high"
          loading="eager"
          width={540}
          height={283}
        />
      </styled.header>
      <CatGallery initialCats={cats} />
    </div>
  );
}
