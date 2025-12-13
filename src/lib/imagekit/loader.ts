import type { ImageLoaderProps } from 'next/image';
import { urlEndpoint } from './config';

export const imagekitLoader = ({
  src,
  width,
  quality,
}: ImageLoaderProps): string => {
  // web proxy の場合署名をつけているのでbaseURLが含まれている想定
  if (src.startsWith(urlEndpoint)) {
    return src;
  }

  return `${urlEndpoint}${src}?tr=w-${width}&q=${quality || 65}`;
};
