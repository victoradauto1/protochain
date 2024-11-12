import TransactionType from "../transactionType";
import Validation from "../validation";
import TransactionInput from "./transactionInput";

/**
 * Mocked Transaction Class
 * */
export default class Transaction {
  type: TransactionType;
  timestamp: number;
  to: string;
  txInput: TransactionInput;
  hash: string;

  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR;
    this.timestamp = tx?.timestamp || Date.now();
    this.to = tx?.to || "CarteiraTo";
    if(tx && tx.txInput){
      this.txInput = new TransactionInput(tx?.txInput)
    }else{
      this.txInput = new TransactionInput()
    }
    this.hash = tx?.hash || this.getHash();
  }

  getHash(): string {
    return "abc";
  }

  isValid(): Validation {
    if (!this.to || this.to == "") return new Validation(false, "Invalid mock transactions");
    if (!this.txInput.IsValid().sucess)
      return new Validation(false, "Invalid mock transaction.");
    return new Validation();
  }
}
