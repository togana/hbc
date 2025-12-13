import { search } from '../api/external/cats';
import { CatGallery } from './components/CatGallery';

export const revalidate = 600;

export default async function Home() {
  const catsResponses = await Promise.all(
    [...Array(5)].map(() =>
      search({
        order: 'random',
      }),
    ),
  );

  const cats = catsResponses.flat();

  return <CatGallery initialCats={cats} />;
}
