import Validation from "../validation";
import Block from "./block";
import BlockInfo from "../blockInfo";
import Transaction from "./transaction";
import TransactionType from "../transactionType";
import TransactionSearch from "../transactionSearch";
import TransactionInput from "./transactionInput";

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
  constructor() {
    this.mempool = [];
    this.blocks = [
      new Block({
        index: this.nextId,
        previousHash: "",
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            txInput: new TransactionInput(),
            hash: "abc"
          } as Transaction),
        ],
      } as Block),
    ];
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
    return this.blocks.find((b) => b.hash === hash);
  }
 
  getFeePerTx(): number {
    return 1;
  }

  getNextBlock(): BlockInfo {
   
    return {
      transactions: [new Transaction({
        txInput: new TransactionInput()
      } as Transaction)],
      difficulty: 0,
      previousHash: this.getLastBlock().hash,
      index: 1,
      feePerTx: this.getFeePerTx() ,
      maxDifficulty: 62,
    } as BlockInfo;
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
  
  /**
   * Valides the whole mock blockchain
   */
  isValid(): Validation {
    // For the mock, let's just return a valid Validation
    return new Validation(true);
  }

  getTransaction(hash: string): TransactionSearch {
    return {
      mempoolIndex:0,
      transaction:{
        hash
      }
    } as TransactionSearch
  }
}
