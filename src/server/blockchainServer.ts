import dotenv from "dotenv";
dotenv.config();

import express, { Application, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import Block from "../lib/block";
import Blockchain from "../lib/blockchain";
import Transaction from "../lib/transaction";
import Wallet from "../lib/wallet";
import transactionOutput from "../lib/transactionOutput";

const PORT: number = parseInt(process.env.BLOCKCHAIN_PORT || "3000");

const app: Application = express();

/* c8 ignore start*/
if (process.argv.includes("--run")) app.use(morgan("tiny"));
/* c8 ignore stop*/

app.use(express.json());

const wallet =  new Wallet(process.env.BLOCKCHAIN_WALLET);

const blockchain = new Blockchain(wallet.publicKey);

app.get("/status", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    mempool: blockchain.mempool.length,
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

app.get(
  "/transactions/:hash?",
  (req: Request, res: Response, next: NextFunction) => {
    if (req.params.hash) {
      res.json(blockchain.getTransaction(req.params.hash));
    } else
      res.json({
        next: blockchain.mempool.slice(0, Blockchain.TX_PER_BLOCK),
        total: blockchain.mempool.length,
      });
  }
);

app.post("/transactions", (req: Request, res: Response, next: NextFunction) => {
  if (req.body.hash === undefined) return res.sendStatus(422);

  const tx = new Transaction(req.body as Transaction);
  const validation = blockchain.addTransaction(tx);

  if (validation.sucess) res.status(201).json(tx);
  else res.status(400).json(validation);
});

app.get("/wallets/:wallet", (req: Request, res: Response, next: NextFunction)=>{
  const wallet =  req.params.wallet;

  //TODO: faer versão final de UTXO;
  return res.json({
    balance: 10,
    fee: blockchain.getFeePerTx(),
    utxo: [new transactionOutput({
      amount: 10,
      toAddress: wallet,
      tx: "abc"
    } as transactionOutput)]
  })

})

/* c8 ignore start */
if (process.argv.includes("--run"))
  app.listen(PORT, () => {
    console.log(`Blockchain is running at ${PORT}. Wallet: ${wallet.publicKey}`);
  });
/* c8 ignore stop */

export { app };
