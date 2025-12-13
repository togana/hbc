import { NextRequest, NextResponse } from 'next/server';
import { cacheLife } from 'next/cache';
import { search } from '../../../../features/cats/api/cats-api';
import type { Cats } from '../../../../features/cats/api/cats-api';

const inRange = (x: number, min: number, max: number): boolean => {
  return (x - min) * (x - max) <= 0;
};

async function fetchCats(page: number): Promise<Cats> {
  'use cache';
  cacheLife('minutes');

  return await search({
    page,
    limit: 50,
    order: 'random',
  });
}

export async function GET(request: NextRequest): Promise<NextResponse<Cats>> {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get('page') || 1);

  // 1~50以外の値の場合は一旦バリデーションエラにする
  if (!inRange(page, 0, 50)) {
    return NextResponse.json([], { status: 422 });
  }

  const externalResponse = await fetchCats(page);

  return NextResponse.json(externalResponse);
}
