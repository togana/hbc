import { css, Global } from '@emotion/react';

export const globalStyles = (
  <Global
    styles={css`
      // Global styles
      html,
      body {
        padding: 0;
        margin: 0;
        min-height: 100%;
        background-color: #000;
        font-family: 'Roboto', 'Noto Sans JP', sans-serif;
        font-size: 16px;
      }
    `}
  />
);
