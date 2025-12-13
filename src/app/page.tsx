import { cacheLife } from 'next/cache';
import Image from 'next/image';
import { search, type Cats } from '../features/cats/api/cats-api';
import { CatGallery } from '../features/cats/components/cat-gallery';

const shuffle = <T extends Cats>([...array]: T): T => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array as T;
};

async function getInitialCats() {
  'use cache';
  cacheLife('minutes');

  const catsResponses = await Promise.all(
    [...Array(5)].map(() =>
      search({
        order: 'random',
      }),
    ),
  );

  // サーバーサイドでシャッフル（キャッシュされるので一貫性が保たれる）
  return shuffle(catsResponses.flat());
}

// #region agent log
const debugLogClient = (location: string, message: string, data: Record<string, unknown>) => {
  if (typeof window !== 'undefined') {
    fetch('http://127.0.0.1:7242/ingest/ea7c6cb7-a69b-438e-8bb4-29e528f4a49a', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location, message, data, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'A' })
    }).catch(() => {});
  }
};
// #endregion

export default async function Home() {
  const cats = await getInitialCats();

  // #region agent log
  // サーバーサイドログ: page.tsx render開始（開発環境のみ）
  if (process.env.NODE_ENV === 'development') {
    try {
      const fs = await import('fs');
      const logEntry = JSON.stringify({ location: 'page.tsx:Home', message: 'Server render started', data: { catsCount: cats.length }, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'D' });
      fs.appendFileSync('/Users/togana/ghq/github.com/togana/hbc/.cursor/debug.log', logEntry + '\n');
    } catch {}
  }
  // #endregion

  return (
    <div>
      {/* LCP要素: Logo.pngをサーバーコンポーネントでレンダリング（preload hintがHTMLに埋め込まれる） */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Image
          src="/Logo.png"
          alt="logo"
          priority
          width={540}
          height={283}
        />
      </header>
      <CatGallery initialCats={cats} />
    </div>
  );
}
