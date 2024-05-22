import { Request, Response } from "express";

export default function availableMarkets(req: Request, res: Response) {
  const { sourceToken, sourceChain, targetChain } = req.query;
  if (!sourceToken && !sourceChain && !targetChain) {
    return res.status(400).send('Missing context information, please provide sourceToken, sourceChain and targetChain');
  }

  const liquidity = {}; //getLiquidity(token as string);
  if (liquidity === undefined) {
    res.status(404).send('No liquidity found');
    return;
  }

  res.json({ liquidity });
}