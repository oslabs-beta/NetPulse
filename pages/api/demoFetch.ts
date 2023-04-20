import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch(`https://api.adviceslip.com/advice`);
  const response2 = await fetch(`https://zenquotes.io/api/today`);
  const response3 = await fetch(`https://swapi.dev/api/people/4`);
  const response4 = await fetch(`https://api.adviceslip.com/advice`);
  const response6 = await fetch(`https://dog.ceo/api/breeds/image/random`);
  const response7 = await fetch(`https://zenquotes.io/api/today`);
  const response8 = await fetch(`https://zenquotes.io/api/today`);

  const data1 = await response.json();
  const data2 = await response2.json();
  const data3 = await response3.json();
  const data4 = await response4.json();
  const data7 = await response7.json();
  const data8 = await response8.json();

  const data: any[] = [data1, data2, data3, data4, response6, data7, data8];

  res.status(200).json(data);
}
