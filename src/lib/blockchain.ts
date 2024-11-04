import Block from "./block";
import BlockInfo from "./blockInfo";
import Transaction from "./transaction";
import TransactionSearch from "./transactionSearch";
import TransactionType from "./transactionType";
import Validation from "./validation";

/**
 * blockchain class
 */
export default class Blockchain {
  blocks: Block[];
  mempool: Transaction[];
  nextId: number = 0;

  static readonly DIFFICULTY_FACTORY = 5;
  static readonly TX_PER_BLOCK = 2;
  static readonly MAX_DIFFICULTY = 62;

  /**
   * Creates a new Blockchain
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
            data: new Date().toString(),
          } as Transaction),
        ],
      } as Block),
    ];
    this.nextId++;
  }
  /**
   * Get the last block at the blockchain
   * @returns The Last Block
   */
  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  getDifficulty(): number {
    return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTORY);
  }

  addTransaction(transaction: Transaction): Validation {
    const validation = transaction.isValid();
    if (!validation.sucess)
      return new Validation(false, "Invalid tx " + validation.message);

    if (
      this.blocks.some((b) =>
        b.transactions.some((tx) => tx.hash === transaction.hash)
      )
    )
      return new Validation(false, "Duplicate tx in blockchain");

    if (this.mempool.some((tx) => tx.hash === transaction.hash))
      return new Validation(false, "Duplicate tx in mempool");

    this.mempool.push(transaction);
    return new Validation(true, transaction.hash);
  }

  /**
   * Add a new block in the blockchain
   * @param block
   * @returns A valid block to be add in the blockchain
   */
  addBlock(block: Block): Validation {
    const lastBlock = this.getLastBlock();

    const validation = block.isValid(
      lastBlock.hash,
      lastBlock.index,
      this.getDifficulty()
    );
    if (!validation.sucess)
      return new Validation(false, `Invalid block ${validation.message}`);

    const txs = block.transactions
      .filter((tx) => tx.type !== TransactionType.FEE)
      .map((tx) => tx.hash);
    const newMempool = (this.mempool = this.mempool.filter(
      (tx) => !txs.includes(tx.hash)
    ));
    if (newMempool.length + txs.length !== this.mempool.length)
      return new Validation(false, "Invalid tx in block");

    this.blocks.push(block);
    this.nextId++;
    return new Validation(true, block.hash);
  }

  getBlock(hash: string): Block | undefined {
    return this.blocks.find((b) => b.hash === hash);
  }

  getTransaction(hash: string): TransactionSearch {
    const mempoolIndex = this.mempool.findIndex((tx) => tx.hash === hash);
    if (mempoolIndex !== -1)
      return {
        mempoolIndex,
        transaction: this.mempool[mempoolIndex],
      } as TransactionSearch;

    const blockIndex = this.blocks.findIndex((b) =>
      b.transactions.some((tx) => tx.hash === hash)
    );


    if (blockIndex !== -1)
      return {
        blockIndex,
        transaction: this.blocks[blockIndex].transactions.find(
          (tx) => tx.hash === hash
        ),
      } as TransactionSearch;

    return {
      mempoolIndex: -1,
      blockIndex: -1
    } as TransactionSearch;
  }

  /**
   * Valides the whole blockchain
   */
  isValid(): Validation {
    for (let i = this.blocks.length - 1; i > 0; i--) {
      const currentBlock = this.blocks[i];
      const previousBlock = this.blocks[i - 1];
      const validation = currentBlock.isValid(
        previousBlock.hash,
        previousBlock.index,
        this.getDifficulty()
      );
      if (!validation.sucess)
        return new Validation(
          false,
          `Invalid block #${currentBlock.index}: ${validation.message}`
        );
    }

    return new Validation();
  }

  getFeePerTx(): number {
    return 1;
  }

  getNextBlock(): BlockInfo | null {
    if (!this.mempool || !this.mempool.length) return null;

    const transactions = this.mempool.slice(0, Blockchain.TX_PER_BLOCK);

    const difficulty = this.getDifficulty();
    const previousHash = this.getLastBlock().hash;
    const index = this.blocks.length;
    const feePerTx = this.getFeePerTx();
    const maxDifficulty = Blockchain.MAX_DIFFICULTY;
    return {
      transactions,
      difficulty,
      previousHash,
      index,
      feePerTx,
      maxDifficulty,
    } as BlockInfo;
  }
}
