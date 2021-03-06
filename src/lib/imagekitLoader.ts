import { ImageLoaderProps } from 'next/image';

const baseUrl = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '';
const loader = ({ src, width, quality }: ImageLoaderProps): string => {
  // web proxy の場合署名をつけているのでbaseURLが含まれている想定
  if (src.startsWith(baseUrl)) {
    return src;
  }

  return `${baseUrl}${src}?tr=w-${width}&q=${quality || 75}`;
};

export default loader;
