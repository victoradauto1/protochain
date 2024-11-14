import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import Block from "../lib/block";
import BlockInfo from "../lib/blockInfo";
import Wallet from "../lib/wallet";
import Transaction from "../lib/transaction";
import TransactionType from "../lib/transactionType";

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;
const minerWallet = new Wallet(process.env.MINER_WALLET)

console.log(`Logges as ${minerWallet.publicKey}`);

let totalMined = 0;

async function mine() {
  console.log("getting next block info. Waiting...");
  const { data } = await axios.get(`${BLOCKCHAIN_SERVER}blocks/next`);
  if (!data) {
    console.log("No tx founded...");
    return setTimeout(() => {
      mine();
    }, 5000);
  }
  const blockInfo = data as BlockInfo;

  const newBlock = Block.fromBlockInfo(blockInfo);

  newBlock.transactions.push(new Transaction({
    to: minerWallet.publicKey,
    type: TransactionType.FEE
  } as Transaction))

  newBlock.miner = minerWallet.publicKey;
  newBlock.hash = newBlock.getHash();

  console.log(`Starting mine block #${blockInfo.index}`);
  newBlock.mine(blockInfo.difficulty, minerWallet.publicKey);

  console.log(`Block mined! Send to blockchain...`);
  console.log(data);

  try {
    await axios.post(`${BLOCKCHAIN_SERVER}blocks/`, newBlock);
    totalMined++;
    console.log(`Total mined blocks: ${totalMined}`);
  } catch (error: any) {
    console.error(error.response ? error.response.data : error.message);
  }

  setTimeout(() => {
    mine();
  }, 1000);
}

mine();
