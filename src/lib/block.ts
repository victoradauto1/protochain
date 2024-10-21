import sha256 from "crypto-js/sha256";
import Validation from "./validation";

/**
 * Block class
 */
export default class Block {
  index: number;
  timestamp: number;
  hash: string;
  previousHash: string;
  data: string;

  /**
   * Creates a new Block
   * @param index The block index in blockchain
   * @param previousHash The previous block Hash
   * @param data The block data
   */
  constructor(index: number, previousHash: string, data: string) {
    this.index = index;
    this.timestamp = Date.now();
    this.previousHash = previousHash;
    this.data = data;
    this.hash = this.getHash();
  }

  getHash(): string {
    return sha256(
      this.index + this.previousHash + this.timestamp + this.data
    ).toString();
  }

  /**
   * Validates the blocks
   * @returns Returns true if the block is valid
   */
  isValid(previousHash: string, previousIndex: number): Validation {
    if (this.timestamp <= 0) return new Validation(false, "Invalid timestamp");
    if (!this.data) return new Validation(false, "Invalid data");
    if (previousIndex != this.index - 1)
      return new Validation(false, "Invalid Index");
    if (this.hash !== this.getHash())
      return new Validation(false, "Invalid hash");
    if (this.previousHash != previousHash)
      return new Validation(false, "Invalid previousHash");

    return new Validation();
  }
}
