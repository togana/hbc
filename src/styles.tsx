import { css, Global } from '@emotion/react';

export const globalStyles = (
  <Global
    styles={css`
      /* https://github.com/elad2412/the-new-css-reset/blob/main/css/reset.css */
      /*** The new CSS Reset - version 1.0.0 (last updated 8.7.2021) ***/

      /* Remove all the styles of the "User-Agent-Stylesheet", except for the 'display' property */
      *:where(:not(iframe, canvas, img, svg, video):not(svg *)) {
        all: unset;
        display: revert;
      }

      /* Preferred box-sizing value */
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      /* Remove list styles (bullets/numbers) */
      ol,
      ul {
        list-style: none;
      }

      /* For images to not be able to exceed their container */
      img {
        max-width: 100%;
      }

      /* removes spacing between cells in tables */
      table {
        border-collapse: collapse;
      }

      html,
      body {
        padding: 0;
        margin: 0;
        min-height: 100%;
        font-family: 'Roboto', 'Noto Sans JP', sans-serif;
        font-size: 16px;
      }
    `}
  />
);
