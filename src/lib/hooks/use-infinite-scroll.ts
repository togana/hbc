'use client';

import { useEffect, useRef, type RefObject } from 'react';

type UseInfiniteScrollOptions = {
  rootMargin?: string;
  enabled?: boolean;
};

export const useInfiniteScroll = (
  onIntersect: () => void,
  options: UseInfiniteScrollOptions = {},
): RefObject<HTMLDivElement | null> => {
  const { rootMargin = '100px', enabled = true } = options;
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [onIntersect, enabled, rootMargin]);

  return sentinelRef;
};
