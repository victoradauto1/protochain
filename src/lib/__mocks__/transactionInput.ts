import Validation from "../validation";

/** Mocked TransactionInput Class */
export default class TransactionInput {
  fromAddress: string;
  amount: number;
  signature: string;
  previousTx: string;

  /**
   * Creates a new transactionInput
   * @param txInput The tx input data
   */
  constructor(txInput?: TransactionInput) {
    this.fromAddress = txInput?.fromAddress || "Carteira 1";
    this.amount = txInput?.amount || 10;
    this.signature = txInput?.signature || "abc";
    this.previousTx = txInput?.previousTx || "xyz";
  }

  /**
   * Generates the tx input signature
   * @param privateKey The 'from' private key
   */
  sign(privateKey: string): void {
    this.signature = "abc";
  }

  /**
   * Generates the tx input hash
   * @returns The tx input hash
   */
  getHash(): string {
    return "abc";
  }

  /**
   * Validates if the tx input is ok
   * @returns returns a validation input object
   */
  IsValid(): Validation {
    if (!this.signature || !this.previousTx) {
      return new Validation(false, "Signature and previous Tx are required.");
    }
    if (this.amount < 1) {
      return new Validation(false, "Amount must be greater than zero.");
    }

    return new Validation();
  }
}
