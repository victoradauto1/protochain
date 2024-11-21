import TransactionType from "../transactionType";
import Validation from "../validation";
import TransactionInput from "./transactionInput";
import transactionOutput from "./transactionOutput";

/**
 * Mocked Transaction Class
 * */
export default class Transaction {
  type: TransactionType;
  timestamp: number;
  hash: string;
  txInputs: TransactionInput[] | undefined;
  txOutputs: transactionOutput[];

  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR;
    this.timestamp = tx?.timestamp || Date.now();
    this.txOutputs = tx?.txOutputs || [new transactionOutput()];
    this.txInputs = tx?.txInputs || [new TransactionInput()];
    this.hash = tx?.hash || this.getHash();
  }

  getHash(): string {
    return "abc";
  }

  isValid(difficulty: number , totalFees: number): Validation {
    if (this.timestamp < 1 || !this.hash || !difficulty || !totalFees)
      return new Validation(false, "Invalid Mock Transaction.");
    return new Validation();
  }
}
