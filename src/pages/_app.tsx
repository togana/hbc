import type { AppProps } from 'next/app';
import { globalStyles } from '../styles';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      {globalStyles}
      <Component {...pageProps} />
    </>
  );
}
export default MyApp;
