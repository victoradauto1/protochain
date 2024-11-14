import sha256 from "crypto-js/sha256";
import TransactionInput from "./transactionInput";
import TransactionType from "./transactionType";
import Validation from "./validation";

/**
 * Transaction Class
 * */
export default class Transaction {
  type: TransactionType;
  timestamp: number;
  hash: string;
  txInput: TransactionInput | undefined;
  to: string;

  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR;
    this.timestamp = tx?.timestamp || Date.now();
    this.to = tx?.to || "";
    if(tx && tx.txInput){
      this.txInput = new TransactionInput(tx?.txInput)
    }else{
      this.txInput = undefined;
    }
    this.hash = tx?.hash || this.getHash();
  }

  getHash(): string {
    if (this.txInput){
      return sha256(
        this.type + this.timestamp + this.txInput.getHash() + this.to
      ).toString();
    } else{
      return sha256(
        this.type + this.timestamp + this.to
      ).toString();
    }
    
  }

  isValid(): Validation {
    if (this.hash !== this.getHash())
      return new Validation(false, "Invalid hash.");
    if (!this.to) 
      return new Validation(false, "Invalid to.");
    if (this.txInput){
      const validation = this.txInput.IsValid();
        if(!validation.sucess) return new Validation(false, `Invalid tx: ${validation.message}`)
    }    
    return new Validation();
  }
}