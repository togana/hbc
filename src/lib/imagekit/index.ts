import ImageKit from 'imagekit';
import { urlEndpoint } from './config';

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint,
});

export { urlEndpoint };

type SignedUrlOptions = {
  width?: number;
  quality?: number;
  expireSeconds?: number;
};

export const createSignedUrl = (
  originalUrl: string,
  options: SignedUrlOptions = {},
): string => {
  const { width = 500, quality = 65, expireSeconds = 3600 * 24 } = options;
  return imagekit.url({
    path: encodeURIComponent(originalUrl),
    transformation: [{ width: String(width), quality: String(quality) }],
    signed: true,
    expireSeconds,
  });
};
