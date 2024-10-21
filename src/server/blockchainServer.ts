import express, { json } from "express";
import morgan from "morgan";
import Blockchain from "../lib/blockhain";

const PORT: number = 3000;

const app = express();
app.use(morgan("tiny"));
app.use(express.json());

const blockchain = new Blockchain();

app.get('/status', (req, res, next)=>{
    res.json({
        numberOfBlocks: blockchain.blocks.length,
        isValid: blockchain.isValid(),
        lastblock: blockchain.getLastBlock()
    })
});

app.listen(PORT, () => {
  console.log(`Blockchain is running at ${PORT}.`);
});
