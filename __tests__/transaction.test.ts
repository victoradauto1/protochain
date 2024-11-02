import Transaction from "../src/lib/transaction";
import TransactionType from "../src/lib/transactionType";


describe("Transaction test", () => {
  test("should be valid (FEE)", () => {
    const tx = new Transaction({
      data: "tx",
      type: TransactionType.FEE,
    } as Transaction);
    const valid = tx.isValid();
    expect(valid.sucess).toBeTruthy();
  });

  test("should be valid (REGULAR with params Invalid Hash)", () => {
    const tx = new Transaction({
      data: "tx",
      type: TransactionType.REGULAR,
      timestamp: Date.now(),
      hash: "abc",
    } as Transaction);
    const valid = tx.isValid();
    expect(valid.sucess).toBeFalsy();
  });

  

  test("should NOT be valid (Invalid Hash)", () => {
    const tx = new Transaction({
      data: "Block 2",
      hash: "abc",
    } as Transaction);
    const valid = tx.isValid();
    expect(valid.sucess).toBeFalsy();
  });

  test("should NOT be valid (Empty Data)", () => {
    const tx = new Transaction();
    const valid = tx.isValid();
    expect(valid.sucess).toBeFalsy();
  });
});
