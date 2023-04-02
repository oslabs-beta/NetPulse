// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch'; //coerce next.js 'fetch' to node-fetch so it is picked up by opentelemetry

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    //make a node fetch request to external api to test open telemetry and socket config
    const response = await fetch('https://swapi.dev/api/people/2');
    const data = await response.json();
    res.status(200).json(data);
}

   
