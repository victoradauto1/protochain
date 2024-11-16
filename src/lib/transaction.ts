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
    if (!this.txOutputs || !this.txOutputs.length || this.txOutputs.map( txo => txo.isValid()).some(v => !v.sucess)) return new Validation(false, "Invalid TXO.");
    if (this.txInputs && this.txInputs.length) {
      const validations = this.txInputs.map(txi => txi.IsValid()).filter(v => !v.sucess);
      if (validations && validations.length){
        const message = validations.map(v => v.message).join(" ");
        return new Validation(false, `Invalid tx: ${message}`)};
    
      const inputSum = this.txInputs.map( txi => txi.amount).reduce((a,b) => a+b, 0);
      const outputSum = this.txInputs.map( txo => txo.amount).reduce((a,b) => a+b, 0);
      if(inputSum < outputSum) return new Validation(false, "invalid tx: input must be equal or greater than output amount.")
    }

    if(this.txOutputs.some(txo => txo.tx !== this.hash)) return new Validation(false, "Invalid TXO reference hash.");

    // TODO: validar taxas e recompensas quando tx.type === FEE.
    return new Validation();
  }
}
