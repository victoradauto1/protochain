import Transaction from "../src/lib/transaction";
import TransactionInput from "../src/lib/transactionInput";
import TransactionType from "../src/lib/transactionType";

jest.mock("../src/lib/transactionInput")
describe("Transaction test", () => {

  test("should be valid (FEE)", () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: "carteiraTo",
      type: TransactionType.FEE,
    } as Transaction);

    tx.txInput = undefined;
    tx.hash = tx.getHash();
    
    const valid = tx.isValid();
    expect(valid.sucess).toBeTruthy();
  });

  test("should be valid (REGULAR with params Invalid Hash)", () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: "carteiraTo",
      type: TransactionType.REGULAR,
      timestamp: Date.now(),
      hash: "abc",
    } as Transaction);
    const valid = tx.isValid();
    expect(valid.sucess).toBeFalsy();
  });

  

  test("should NOT be valid (Invalid Hash)", () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: "carteiraTo",
      hash: "abc",
    } as Transaction);
    const valid = tx.isValid();
    expect(valid.sucess).toBeFalsy();
  });

  test("should NOT be valid (Invalid to)", () => {
    const tx = new Transaction();
    const valid = tx.isValid();
    expect(valid.sucess).toBeFalsy();
  });

  test("should NOT be valid (Invalid txInput)", () => {
    const tx = new Transaction({
      to: "carteiraTo",
      txInput: new TransactionInput({
        amount: -10,
        fromAddress: "From",
        signature: "abc"
      } as TransactionInput)
    } as Transaction);
    const valid = tx.isValid();
    expect(valid.sucess).toBeFalsy();
  });
});
