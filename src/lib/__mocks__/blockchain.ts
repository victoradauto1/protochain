import Validation from "../validation";
import Block from "./block";
import BlockInfo from "../blockInfo";
import Transaction from "./transaction";
import TransactionSearch from "../transactionSearch";
import TransactionInput from "./transactionInput";
import TransactionOutput from "./transactionOutput";

/**
 * Mocked blockchain class
 */
export default class Blockchain {
  blocks: Block[];
  mempool: Transaction[];
  nextId: number = 0;

  static readonly DIFFICULTY_FACTORY = 5;
  static readonly TX_PER_BLOCK = 2;
  static readonly MAX_DIFFICULTY = 62;

  /**
   * Creates a new Mock Blockchain
   */
  constructor(miner: string) {
    this.blocks = [];
    this.mempool = [new Transaction()];

    this.blocks. push( new Block({
      index: 0,
      hash: "abc",
      previousHash: "",
      miner,
      timestamp: Date.now()
    } as Block));
    this.nextId++;
  }
  /**
   * Get the last mock block at the mock blockchain
   * @returns The Last Mock Block
   */
  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  /**
   * Add a new mock block in the blockchain
   * @param mock block
   * @returns A valid mock block to be add in the blockchain
   */
  addBlock(block: Block): Validation {
    if(block.index < 0) return new Validation(false, "Invalid mock block");

    this.blocks.push(block);
    this.nextId++;
    return new Validation();
  }

  getBlock(hash: string): Block | undefined {
    if(!hash || hash === "-1")
      return undefined;
    return this.blocks.find((b) => b.hash === hash);
  }
 
  addTransaction(transaction: Transaction): Validation {
    const validation = transaction.isValid();
    if(!validation.sucess) return validation;
    this.mempool.push(transaction)
    return new Validation();
    }
  
  getDifficulty(): number {
    // For the mock, let's just return a constant value
    return 5;
  }

  getTransaction(hash: string): TransactionSearch {
    if(hash === "-1")
      return { mempoolIndex: -1, blockIndex: -1} as TransactionSearch;
    return {
      mempoolIndex:0,
      transaction:new Transaction()
    } as TransactionSearch
  };

   
  /**
   * Valides the whole mock blockchain
   */
  isValid(): Validation {
    // For the mock, let's just return a valid Validation
    return new Validation(true);
  }

  
  getFeePerTx(): number {
    return 1;
  }

  getNextBlock(): BlockInfo {
   
    return {
      transactions: this.mempool.slice(0,2),
      difficulty: 2,
      previousHash: this.getLastBlock().hash,
      index: this.blocks.length,
      feePerTx: this.getFeePerTx() ,
      maxDifficulty: 62,
    } as BlockInfo;
  };

  getTxInputs(wallet: string): (TransactionInput | undefined)[]{
    return [new TransactionInput({
      amount: 10,
      fromAddress: wallet,
      previousTx: "abc",
      signature: "abc"
    } as TransactionInput)]
  };

  getTxOutputs(wallet: string): TransactionOutput[] {
    return [new TransactionOutput({
      amount: 10,
      toAddress: wallet,
      tx: "abc"
    } as TransactionOutput)]
  };

  getUtxo(wallet: string) : TransactionOutput[]{
    return this.getTxOutputs(wallet);
  };

  getBalance(wallet: string): number{
    return 10;
  }



}
