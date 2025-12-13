import { resetStyles } from './reset';
import { globalStyles } from './global';
import { Fragment } from 'react';

// 後方互換性のため、両方のスタイルを組み合わせたエクスポート
const combinedGlobalStyles = (
  <Fragment>
    {resetStyles}
    {globalStyles}
  </Fragment>
);

export default combinedGlobalStyles;
