import { useState, useCallback, useRef } from 'react';
import type { Cats } from '../api/external/cats';

type UseCatsInfiniteReturn = {
  data: Cats;
  isLoading: boolean;
  error: Error | null;
  loadMore: () => void;
  hasMore: boolean;
};

export const useCatsInfinite = (
  initialData: Cats = [],
): UseCatsInfiniteReturn => {
  const [data, setData] = useState<Cats>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const nextPage = pageRef.current + 1;
      const response = await fetch(`/api/cats/search?page=${nextPage}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newCats: Cats = await response.json();

      if (newCats.length === 0) {
        setHasMore(false);
      } else {
        setData((current) => [...current, ...newCats]);
        pageRef.current = nextPage;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore]);

  return { data, isLoading, error, loadMore, hasMore };
};
