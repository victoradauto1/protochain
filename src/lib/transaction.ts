import sha256 from "crypto-js/sha256";
import TransactionInput from "./transactionInput";
import transactionOutput from "./transactionOutput";
import TransactionType from "./transactionType";
import Validation from "./validation";

/**
 * Transaction Class
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

    this.txInputs = tx?.txInputs
      ? tx.txInputs.map((txi) => new TransactionInput(txi))
      : undefined;

    this.txOutputs = tx?.txOutputs
      ? tx.txOutputs.map((txo) => new transactionOutput(txo))
      : [];

    this.hash = tx?.hash || this.getHash();

    this.txOutputs.forEach((txo, index, arr) => (arr[index].tx = this.hash));
  }

  getHash(): string {
    const from =
      this.txInputs && this.txInputs.length
        ? this.txInputs.map((txi) => txi.signature).join(",")
        : "";

    const to =
      this.txOutputs && this.txOutputs.length
        ? this.txOutputs.map((txo) => txo.getHash()).join(",")
        : "";

    return sha256(this.type + from + to + this.timestamp).toString();
  }

  isValid(): Validation {
    if (this.hash !== this.getHash())
      return new Validation(false, "Invalid hash.");
    if (!this.txOutputs || !this.txOutputs.length) return new Validation(false, "Invalid to.");
    if (this.txInput) {
      const validation = this.txInput.IsValid();
      if (!validation.sucess)
        return new Validation(false, `Invalid tx: ${validation.message}`);
    }
    return new Validation();
  }
}
