import type { NextApiRequest, NextApiResponse } from 'next';
import { search } from '../../../api/external/cats';
import type { Cats } from '../../../api/external/cats';

const inRange = (x: number, min: number, max: number): boolean => {
  return (x - min) * (x - max) <= 0;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Cats>,
): Promise<void> => {
  // 1~100以外の値の場合は一旦バリデーションエラにする
  const page = Number(req.query?.page || 1);
  if (!inRange(page, 0, 10)) {
    res.status(422).json([]);
    return;
  }

  const externalResponse = await search({
    page,
    limit: 30,
    order: 'random',
  });
  res.status(200).json(externalResponse);
};

export default handler;
