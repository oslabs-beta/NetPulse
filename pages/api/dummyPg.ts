// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

const { pool } = require('../../server');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const users = await pool.query('SELECT * FROM users');
  res.status(200).json(users.rows);
}
