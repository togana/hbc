import '@emotion/react';
import { theme } from './index';

type ThemeConfig = typeof theme;

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends ThemeConfig {}
}
