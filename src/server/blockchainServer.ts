import express, { Application } from "express";
import morgan from "morgan";
import Block from "../lib/block";
import Blockchain from "../lib/blockchain";

const PORT: number = 3000;

const app: Application = express();

if (process.argv.includes("--run")) app.use(morgan("tiny"));
app.use(express.json());

const blockchain = new Blockchain();

app.get("/blocks/:indexOrHash", (req, res, next) => {
  let block;
  if (/^[0-9]+$/.test(req.params.indexOrHash))
    block = res.json(blockchain.blocks[parseInt(req.params.indexOrHash)]);
  else block = res.json(blockchain.getBlock(req.params.indexOrHash));

  if (!block) return res.sendStatus(404);
  else return res.json(block);
});

app.get("/status", (req, res, next) => {
  res.json({
    numberOfBlocks: blockchain.blocks.length,
    isValid: blockchain.isValid(),
    lastblock: blockchain.getLastBlock(),
  });
});

app.post("/blocks", (req, res, next) => {
  if (req.body.hash === undefined) return res.sendStatus(422);

  const block = new Block(req.body as Block);
  const validation = blockchain.addBlock(block);

  if (validation.sucess) res.status(201).json(block);
  else res.status(400).json(validation);
});

if (process.argv.includes("--run"))
  app.listen(PORT, () => {
    console.log(`Blockchain is running at ${PORT}.`);
  });

export { app };
