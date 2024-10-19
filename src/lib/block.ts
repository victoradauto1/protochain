import sha256 from "crypto-js/sha256";
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
  isValid(previousHash: string, previousIndex:number): boolean {

    if (this.timestamp <= 0) return false;
    if (!this.data) return false;
    if (previousIndex != this.index -1) return false;
    if (!this.hash) return false;
    if (this.previousHash != previousHash) return false;
    
    return true;
  }
}
