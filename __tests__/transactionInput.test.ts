import TransactionInput from "../src/lib/transactionInput";
import Wallet from "../src/lib/wallet";

describe("Wallet tests", () => {

    let alice: Wallet;
    let bob: Wallet;

    beforeAll(()=>{
        alice = new Wallet();
        bob = new Wallet();
    });

  test("Should be valid", () => {
    const txInput = new TransactionInput({
        amount: 10,
        fromAddress: alice.publicKey,
        previousTx: "abc"
    } as TransactionInput);
    txInput.sign(alice.privateKey);
    expect(txInput.IsValid().sucess).toBeTruthy();
  });

  test("Should NOT be valid (negative amount)", () => {
    const txInput = new TransactionInput({
        amount: -1,
        fromAddress: alice.publicKey,
        previousTx: "abc"
    } as TransactionInput);
    txInput.sign(alice.privateKey);
    expect(txInput.IsValid().sucess).toBeFalsy();
  });

  test("Should NOT be valid (invalid signature)", () => {
    const txInput = new TransactionInput({
        amount: -1,
        fromAddress: alice.publicKey,
        previousTx: "abc"
    } as TransactionInput);
    txInput.sign(bob.privateKey);
    expect(txInput.IsValid().sucess).toBeFalsy();
  });

  test("Should NOT be valid (previous tx)", () => {
    const txInput = new TransactionInput({
        amount: 1,
        fromAddress: alice.publicKey,
    } as TransactionInput);
    txInput.sign(alice.privateKey);
    expect(txInput.IsValid().sucess).toBeFalsy();
  });

  test("Should NOT be valid (defaults)", () => {
    const txInput = new TransactionInput({
    } as TransactionInput);
    txInput.sign(alice.privateKey);
    expect(txInput.IsValid().sucess).toBeFalsy();
  });
});