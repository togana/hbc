import '@emotion/react';
import { theme } from './index';

type ThemeConfig = typeof theme;

declare module '@emotion/react' {
  export interface Theme extends ThemeConfig {}
}
