import { resetStyles } from './reset';
import { globalStyles } from './global';
import { Fragment } from 'react';

// 後方互換性のため、両方のスタイルを組み合わせたエクスポート
// Fast Refreshを正しく動作させるため、直接JSX要素をエクスポート
export default function GlobalStyles() {
  return (
    <Fragment>
      {resetStyles}
      {globalStyles}
    </Fragment>
  );
}
