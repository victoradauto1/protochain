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
  nonce: number;
  miner: string;

  /**
   * Creates a new Block
   * @param block The block data
   */
  constructor(block?: Block) {
    this.index = block?.index || 0;
    this.timestamp = block?.timestamp || Date.now();
    this.previousHash = block?.previousHash || "";
    this.data = block?.data || "";
    this.nonce = block?.nonce || 0;
    this.miner = block?.miner || "";
    this.hash = block?.hash || this.getHash();
  }

  getHash(): string {
    return sha256(
      this.index +
        this.previousHash +
        this.timestamp +
        this.data +
        this.nonce +
        this.miner
    ).toString();
    }
  
    /**
     * Generates a new valid hash for this block  wtih the specified difficulty 
     * @param difficulty The blockchain current difficult
     * @param miner The miner wallet adress
     */
    mine(difficulty: number,  miner: string){
      this.miner = miner;
      const prefix = new Array(difficulty + 1).join("0");

      do {
        this.nonce++;
        this.hash = this.getHash();
      } while (!this.hash.startsWith(prefix));
    }

  /**
   * Validates the blocks
   * @returns Returns true if the block is valid
   * @param previousHash The previous block hash
   * @param previousIndex The ptrvious block index
   * @param difficult The blockchain current difficult
   */
  isValid(
    previousHash: string,
    previousIndex: number,
    difficulty: number
  ): Validation {
    if (this.timestamp <= 0) return new Validation(false, "Invalid timestamp");
    if (!this.data) return new Validation(false, "Invalid data");
    if (previousIndex != this.index - 1)
      return new Validation(false, "Invalid Index")
    if (this.previousHash != previousHash)
      return new Validation(false, "Invalid previousHash");
    if(!this.nonce || !this.miner) return new Validation(false, "No mined");

    const prefix =  new Array(difficulty + 1).join("0");
    if (this.hash !== this.getHash() || !this.hash.startsWith(prefix))
      return new Validation(false, "Invalid hash");

    return new Validation();
  }
}
