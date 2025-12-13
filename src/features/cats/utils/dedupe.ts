import type { Cat } from '../types';

export const dedupeCats = (cats: readonly Cat[]): Cat[] => {
  const seenIds = new Set<string>();
  return cats.filter((cat) => {
    if (seenIds.has(cat.id)) return false;
    seenIds.add(cat.id);
    return true;
  });
};
