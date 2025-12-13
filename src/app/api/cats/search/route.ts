import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { search } from '../../../../features/cats/api/cats-api';
import type { Cats } from '../../../../features/cats/types';
import { CATS_API } from '../../../../features/cats/constants';

const isValidPage = (page: number): boolean => {
  return page >= CATS_API.MIN_PAGE && page <= CATS_API.MAX_PAGE;
};

const fetchCats = unstable_cache(
  async (page: number): Promise<Cats> => {
    return await search({
      page,
      limit: CATS_API.DEFAULT_LIMIT,
      order: 'random',
    });
  },
  ['cats-search'],
  { revalidate: 300 }, // 5分間キャッシュ
);

export async function GET(request: NextRequest): Promise<NextResponse<Cats>> {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get('page') || 1);

  if (!isValidPage(page)) {
    return NextResponse.json([], { status: 422 });
  }

  const externalResponse = await fetchCats(page);

  return NextResponse.json(externalResponse);
}
