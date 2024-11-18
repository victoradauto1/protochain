import Validation from "../validation";

/**
 * Mocked Transaction Output class
 */
export default class transactionOutput {
  toAddress: string;
  amount: number;
  tx?: string;

  constructor(txOutput?: transactionOutput) {
    this.toAddress = txOutput?.toAddress || "abc";
    this.amount = txOutput?.amount || 10;
    this.tx = txOutput?.tx || "xyz";
  }

  isValid(): Validation {
    if (this.amount < 1) return new Validation(false, "Nagative amount.");
    return new Validation();
  };

  getHash(): string{
    return "abc"
  };
}
