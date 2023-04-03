import fetch from 'node-fetch';

export async function GET(req: Request, res: Response) {
    return res.status(200).json("api route success");
}
  