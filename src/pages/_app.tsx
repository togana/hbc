import type { AppProps } from 'next/app';
import { ThemeProvider } from '@emotion/react';
import { globalStyles } from '../styles';
import { theme } from '../theme';

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <ThemeProvider theme={theme}>
      {globalStyles}
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
export default MyApp;
