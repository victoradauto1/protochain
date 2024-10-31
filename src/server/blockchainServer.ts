import dotenv from "dotenv";
dotenv.config();

import express, { Application, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import Block from "../lib/block";
import Blockchain from "../lib/blockchain";

const PORT: number = parseInt(process.env.BLOCKCHAIN_PORT || "3000");

const app: Application = express();

/* c8 ignore start*/
if (process.argv.includes("--run")) app.use(morgan("tiny"));
app.use(express.json());
/* c8 ignore stop*/

const blockchain = new Blockchain();

app.get("/status", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    numberOfBlocks: blockchain.blocks.length,
    isValid: blockchain.isValid(),
    lastblock: blockchain.getLastBlock(),
  });
});

app.get("/blocks/next", (req: Request, res: Response, next: NextFunction) => {
  res.json(blockchain.getNextBlock());
});

app.get(
  "/blocks/:indexOrHash",
  (req: Request, res: Response, next: NextFunction) => {
    let block;
    if (/^-?\d+$/.test(req.params.indexOrHash)) {
      // Modificado aqui para aceitar números negativos
      const index = parseInt(req.params.indexOrHash);
      if (index < 0 || index >= blockchain.blocks.length)
        return res.sendStatus(404);
      block = blockchain.blocks[index];
    } else {
      block = blockchain.getBlock(req.params.indexOrHash);
    }

    if (!block) return res.sendStatus(404);
    return res.json(block);
  }
);

app.post("/blocks", (req: Request, res: Response, next: NextFunction) => {
  if (req.body.hash === undefined) return res.sendStatus(422);

  const block = new Block(req.body as Block);
  const validation = blockchain.addBlock(block);

  if (validation.sucess) res.status(201).json(block);
  else res.status(400).json(validation);
});

/* c8 ignore start */
if (process.argv.includes("--run"))
  app.listen(PORT, () => {
    console.log(`Blockchain is running at ${PORT}.`);
  });
/* c8 ignore stop */

export { app };
