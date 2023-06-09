// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

const { Movie } = require('../../tracing');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await Movie.find({})
    .then((data: any) => res.status(200).json(data[0]))
    .catch((err: any) => {
      console.log('error:', err);
      return res.status(404).json('Mongoose Error');
    });
}
