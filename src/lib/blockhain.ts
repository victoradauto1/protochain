import Block from "./block";
import Validation from "./validation";

/**
 * blockchain class
 */
export default class Blockchain {
  blocks: Block[];
  nextId: number = 0;

  /**
   * Creates a new Blockchain
   */
  constructor() {
    this.blocks = [new Block(this.nextId, "", "Genesis Block")];
    this.nextId++;
  }
  /**
   * Get the last block at the blockchain
   * @returns The Last Block
   */
  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  /**
   * Add a new block in the blockchain
   * @param block
   * @returns A valid block to be add in the blockchain
   */
  addBlock(block: Block): Validation {
    const lastBlock = this.getLastBlock();

    const validation = block.isValid(lastBlock.hash, lastBlock.index);
    if (!validation.sucess) return new Validation(false, `Invalid block ${validation.message}`);
    this.blocks.push(block);
    this.nextId++;
    return new Validation();
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
        previousBlock.index
      );
      if (!validation.sucess) return new Validation(false,  `Invalid block #${currentBlock.index}: ${validation.message}`);
    }

    return new Validation();
  }
}
