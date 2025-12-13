import { cacheLife } from 'next/cache';
import Image from 'next/image';
import { styled } from '../styled-system/jsx';
import { search } from '../features/cats/api/cats-api';
import { CatGallery } from '../features/cats/components/cat-gallery';
import { shuffle } from '../lib/utils/shuffle';

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
