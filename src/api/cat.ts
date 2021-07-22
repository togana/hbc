import ImageKit from 'imagekit';
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

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
});

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
