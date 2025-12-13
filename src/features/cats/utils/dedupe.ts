import type { Cat } from '../types';

export const dedupeCats = (cats: readonly Cat[]): Cat[] => {
  return [...new Map(cats.map((cat) => [cat.id, cat])).values()];
};
