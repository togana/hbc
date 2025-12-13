export type Order = 'desc' | 'asc' | 'random';

export type Cat = {
  id: string;
  url: string;
};

export type Cats = Cat[];

export type CatsRequest = {
  order?: Order;
  page?: number;
  limit?: number;
};
