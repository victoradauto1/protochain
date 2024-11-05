import Transaction from "./transaction";

export default interface TransactionSearch {
  transaction: Transaction | null;
  mempoolIndex: number;
  blockIndex: number;
}
