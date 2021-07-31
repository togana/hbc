import { imagekit } from '../../lib/imageKitClient';
import fetcher from '../../lib/apiClient';

type Order = 'desc' | 'asc' | 'random';

export type CatsRequest = {
  order?: Order;
  page?: number;
  limit?: number;
};

type Cat = {
  id: string;
  url: string;
};

export type Cats = Cat[];

export const search = async ({
  page = 1,
  limit = 50,
  order: order = 'desc',
}: CatsRequest): Promise<Cats> => {
  const res = await fetcher.get<Cats>('/v1/images/search', {
    params: {
      page,
      limit,
      order,
      mime_types: 'jpg,png',
    },
  });

  const signedUrls = res.data.map((cat) => {
    const imageURL = imagekit.url({
      path: encodeURIComponent(cat.url),
      transformation: [
        {
          width: '500',
          quality: '75',
        },
      ],
      signed: true,
      expireSeconds: 3600 * 24,
    });
    return {
      id: cat.id,
      url: imageURL,
    };
  });
  return signedUrls;
};
