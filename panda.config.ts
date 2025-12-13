import { defineConfig } from '@pandacss/dev';
import presetBase from '@pandacss/preset-base';

export default defineConfig({
  presets: [presetBase],
  preflight: true,
  include: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      breakpoints: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
      },
    },
  },
  globalCss: {
    'html, body': {
      padding: 0,
      margin: 0,
      minHeight: '100%',
      backgroundColor: '#000',
    },
  },
  jsxFramework: 'react',
  outdir: 'src/styled-system',
});
