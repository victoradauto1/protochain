import Validation from "../validation";
import Block from "./block";

/**
 * Mocked blockchain class
 */
export default class Blockchain {
  blocks: Block[];
  nextId: number = 0;

  /**
   * Creates a new Mock Blockchain
   */
  constructor() {
    this.blocks = [
      new Block({
        index: 0,
        hash: "abc",
        previousHash: "",
        data: "Genesis Block",
        timestamp: Date.now(),
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

  /**
   * Valides the whole mock blockchain
   */
  isValid(): Validation {
    return new Validation();
  }
}
