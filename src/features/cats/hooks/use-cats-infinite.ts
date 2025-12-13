import { useState, useCallback, useRef } from 'react';
import type { Cats } from '../api/cats-api';

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
  // 初期データから重複を排除
  const getUniqueCats = (cats: Cats): Cats => {
    const seenIds = new Set<string>();
    return cats.filter((cat) => {
      if (seenIds.has(cat.id)) {
        return false;
      }
      seenIds.add(cat.id);
      return true;
    });
  };

  const [data, setData] = useState<Cats>(() => getUniqueCats(initialData));
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
        setData((current) => {
          // 既存のIDのセットを作成
          const existingIds = new Set(current.map((cat) => cat.id));
          // 新しいデータから重複を除外
          const uniqueNewCats = newCats.filter((cat) => !existingIds.has(cat.id));
          return [...current, ...uniqueNewCats];
        });
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
