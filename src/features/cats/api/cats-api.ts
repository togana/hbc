import apiClient from '../../../lib/api-client';
import { createSignedUrl } from '../../../lib/imagekit';
import type { Cat, Cats, CatsRequest } from '../types';
import { CATS_API } from '../constants';

export type { Cat, Cats, CatsRequest };

export const search = async ({
  page = 1,
  limit = CATS_API.DEFAULT_LIMIT,
  order: order = 'desc',
}: CatsRequest): Promise<Cats> => {
  const res = await apiClient.get<Cats>('/v1/images/search', {
    params: {
      page,
      limit,
      order,
      mime_types: 'jpg,png',
    },
  });

  return res.data.map((cat) => ({
    id: cat.id,
    url: createSignedUrl(cat.url),
  }));
};
