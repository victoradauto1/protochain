import Block from "./block";

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
  addBlock(block: Block): boolean {
    const lastBlock = this.getLastBlock();
    if (!block.isValid(lastBlock.hash, lastBlock.index)) return false;
    this.blocks.push(block);
    this.nextId++;
    return true;
  }

  /**
   * Valides the whole blockchain
   */
  isValid() {
    for (let i = this.blocks.length - 1; i > 0; i--) {
      const currentBlock = this.blocks[i];
      const previousBlock = this.blocks[i - 1];
      const isValid = currentBlock.isValid(
        previousBlock.hash,
        previousBlock.index
      );
      if (!isValid) return false;
    }

    return true;
  }
}
