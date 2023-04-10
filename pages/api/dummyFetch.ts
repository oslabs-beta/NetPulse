// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch'; // coerce next.js 'fetch' to node-fetch so it is picked up by opentelemetry

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // make many fetches at once
  const response = await fetch(`https://swapi.dev/api/people/4`);
  const response2 = await fetch(`https://zenquotes.io/api/today`);
  const response3 = await fetch(`https://api.adviceslip.com/advice`);
  const response4 = await fetch(`https://api.adviceslip.com/advice`);
  const response5 = await fetch(`https://swapi.co/api/films`);
  // const response6 = await fetch(`https://dog.ceo/api/breeds/image/random`);
  // const response7 = await fetch(`https://randombig.cat/roar.json`);
  // const response8 = await fetch(`https://api.apis.guru/v2/list.json`);
  // const response9 = await fetch(`https://www.gov.uk/bank-holidays.json`);
  // const response10 = await fetch(`https://api.coinbase.com/v2/currencies`);
  // const response11 = await fetch(`https://api.coinlore.net/api/tickers/`);
  // const response12 = await fetch(`https://www.cryptingup.com/api/markets`);
  // const response13 = await fetch(`https://api.exchangerate.host/latest`);
  // const response14 = await fetch(`https://api.kraken.com/0/public/Trades?pair=ltcusd`);
  // const response15 = await fetch(`https://favicongrabber.com/api/grab/github.com`);

  const data1 = await response.json();
  const data2 = await response2.json();
  const data3 = await response3.json();
  const data4 = await response4.json();
  const data5 = await response5.json();
  const data6 = await response5.json();
  const data7 = await response5.json();
  const data8 = await response5.json();
  const data9 = await response5.json();
  const data10 = await response5.json();
  const data11 = await response5.json();
  const data12 = await response5.json();
  const data13 = await response5.json();
  const data14 = await response5.json();
  const data15 = await response5.json();

  const data: any[] = [
    data1,
    data2,
    data3,
    data4,
    data5,
    data6,
    data7,
    data8,
    data9,
    data10,
    data11,
    data12,
    data13,
    data14,
    data15,
  ];

  res.status(200).json(data);
}
