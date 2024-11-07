import TransactionInput from "../src/lib/transactionInput";
import Wallet from "../src/lib/wallet";

describe("Wallet tests", () => {

    let alice: Wallet;

    beforeAll(()=>{
        alice = new Wallet();
    });

  test("Should be valid", () => {
    const txInput = new TransactionInput({
        amount: 10,
        fromAddress: alice.publicKey,
    } as TransactionInput);
    txInput.sign(alice.privateKey);
    expect(txInput.IsValid().sucess).toBeTruthy();
  });
});