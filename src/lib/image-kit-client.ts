import ImageKit from 'imagekit';

const baseUrl = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '';

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: baseUrl,
});
