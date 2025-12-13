import { NextRequest, NextResponse } from 'next/server';
import { search } from '../../../../api/external/cats';
import type { Cats } from '../../../../api/external/cats';

const inRange = (x: number, min: number, max: number): boolean => {
  return (x - min) * (x - max) <= 0;
};

export async function GET(request: NextRequest): Promise<NextResponse<Cats>> {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get('page') || 1);

  // 1~50以外の値の場合は一旦バリデーションエラにする
  if (!inRange(page, 0, 50)) {
    return NextResponse.json([], { status: 422 });
  }

  const externalResponse = await search({
    page,
    limit: 50,
    order: 'random',
  });

  return NextResponse.json(externalResponse);
}
