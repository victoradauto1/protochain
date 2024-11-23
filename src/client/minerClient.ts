import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import Block from "../lib/block";
import BlockInfo from "../lib/blockInfo";
import Transaction from "../lib/transaction";
import transactionOutput from "../lib/transactionOutput";
import TransactionType from "../lib/transactionType";
import Wallet from "../lib/wallet";
import Blockchain from "../lib/blockchain";

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;
const minerWallet = new Wallet(process.env.MINER_WALLET);

console.log(`Logges as ${minerWallet.publicKey}`);

let totalMined = 0;

function getRewardTx(blockInfo: BlockInfo, nextBlock: Block): Transaction | undefined{
  let amount = 0;

  if(blockInfo.difficulty > blockInfo.maxDifficulty){
    amount += Blockchain.getRewardAmount(blockInfo.difficulty)
  };

  const fees =  nextBlock.transactions.map( tx => tx.getFee()).reduce((a,b)=> a+b);
  const feeCheck = nextBlock.transactions.length * blockInfo.feePerTx;
  if(fees < feeCheck){
    console.log("Low fees. Awaiting next block.");
    setTimeout(()=>{
      mine();
    }, 5000);
    return;
  };
  amount += fees;

  const txo = new transactionOutput({
    toAddress: minerWallet.publicKey,
    amount
  } as transactionOutput);

  return Transaction.fromReward(txo);
}

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

  const tx = getRewardTx(blockInfo, newBlock);
  if(!tx) return;

  newBlock.transactions.push(tx);

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
