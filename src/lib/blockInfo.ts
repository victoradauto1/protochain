import Transaction from "./transaction";

/**
 *  The Blockchain inteface contend informations to
 */
export default interface BlockInfo {
  index: number;
  previousHash: string;
  difficulty: number;
  maxDifficulty: number;
  feePerTx: number;
  transactions: Transaction[];
}
