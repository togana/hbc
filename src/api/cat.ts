import fetcher from '../lib/apiClient';

type order = 'desc' | 'asc' | 'random';
type request = {
  order?: order;
  page?: number;
  limit?: number;
};

type cat = {
  id: string;
  url: string;
};

export type cats = cat[];

export const search = async ({
  page = 1,
  limit = 30,
  order: order = 'desc',
}: request): Promise<cats> => {
  const res = await fetcher.get<cats>('/v1/images/search', {
    params: {
      page,
      limit,
      order,
      mime_types: 'jpg,png',
    },
  });
  return res.data;
};
