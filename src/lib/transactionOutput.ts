import { SHA256 } from "crypto-js";
import Validation from "./validation";

/**
 * Transaction Output class
 */
export default class transactionOutput {
  toAddress: string;
  amount: number;
  tx?: string;

  constructor(txOutput?: transactionOutput) {
    this.toAddress = txOutput?.toAddress || "";
    this.amount = txOutput?.amount || 0;
    this.tx = txOutput?.tx || "";
  }

  isValid(): Validation {
    if (this.amount < 1) return new Validation(false, "Nagative amount.");
    return new Validation();
  };

  getHash(): string{
    return SHA256(this.toAddress + this.amount + this.tx).toString();
  };
}
