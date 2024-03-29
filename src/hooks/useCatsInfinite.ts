import useSWRInfinite from 'swr/infinite';
import type { KeyLoader } from 'swr';
import type { Cats } from '../api/external/cats';
import { fetcher } from '../lib/fetcher';

const getKey: KeyLoader = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData.length) return null;
  return `/api/cats/search?page=${pageIndex + 1}`;
};

export const useCatsInfinite = () => useSWRInfinite<Cats>(getKey, fetcher);
