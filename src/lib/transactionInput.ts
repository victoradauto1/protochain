import SHA256 from "crypto-js/sha256";
import ECPairFactory from "ecpair";
import * as ecc from "tiny-secp256k1";
import Validation from "./validation";

const ECPair = ECPairFactory(ecc);

/**TransactionInput Class */
export default class TransactionInput {
  fromAddress: string;
  amount: number;
  signature: string;

  /**
   * Creates a new transactionInput
   * @param txInput The tx input data
   */
  constructor(txInput?: TransactionInput) {
    this.fromAddress = txInput?.fromAddress || "";
    this.amount = txInput?.amount || 0;
    this.signature = txInput?.signature || "";
  }

  /**
   * Generates the tx input signature
   * @param privateKey The 'from' private key
   */
  sign(privateKey: string): void {
    const preSignature = ECPair.fromPrivateKey(Buffer.from(privateKey, "hex"))
      .sign(Buffer.from(this.getHash(), "hex"))
      .toString();
    Buffer.isBuffer(preSignature)
      ? (this.signature = preSignature)
      : (this.signature = Buffer.from(preSignature).toString("hex"));
  }

  /**
   * Generates the tx input hash
   * @returns The tx input hash
   */
  getHash(): string {
    return SHA256(this.fromAddress + this.amount).toString();
  }

  /**
   * Validates if the tx input is ok
   * @returns returns a validation input object
   */
  IsValid(): Validation {
    if (!this.signature) {
      return new Validation(false, "Signature is required.");
    }
    if (this.amount < 1) {
      return new Validation(false, "Amount must be greater than zero.");
    }

    const hash = Buffer.from(this.getHash(), "hex");

    try {
      const publicKey = Buffer.from(this.fromAddress, "hex");
      const isValid = ECPair.fromPublicKey(publicKey).verify(
        hash,
        Buffer.from(this.signature, "hex")
      );
      return isValid
        ? new Validation(true, "Transaction input is valid.")
        : new Validation(false, "Invalid transaction input signature.");
    } catch (error) {
      return new Validation(false, "Invalid public key or signature format.");
    }
  }
}
