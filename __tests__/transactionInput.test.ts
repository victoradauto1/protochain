import TransactionInput from "../src/lib/transactionInput";
import transactionOutput from "../src/lib/transactionOutput";
import Wallet from "../src/lib/wallet";

describe("Wallet tests", () => {
  let alice: Wallet;
  let bob: Wallet;
  const exampleTx: string =
    "4885d8f8ee0452d2d97a475028c124e13e8b1e716545857e8b0bd72f70fbe2ea";

  beforeAll(() => {
    alice = new Wallet();
    bob = new Wallet();
  });

  // Test 1
  test("1. Should be valid", () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAddress: alice.publicKey,
      previousTx: "abc",
    } as TransactionInput);
    txInput.sign(alice.privateKey);
    expect(txInput.IsValid().sucess).toBeTruthy();
  });

   // Test 2
  test("2. Should be valid (fallback values - default)", () => {
    const txInput = new TransactionInput();
    txInput.previousTx = 'abc';
    txInput.signature = alice.privateKey
    expect(txInput.IsValid().sucess).toBeTruthy();
  });

  // Test 3
  test("3. Should NOT be valid (negative amount)", () => {
    const txInput = new TransactionInput({
      amount: -1,
      fromAddress: alice.publicKey,
      previousTx: "abc",
    } as TransactionInput);
    txInput.sign(alice.privateKey);
    expect(txInput.IsValid().sucess).toBeFalsy();
  });

  // Test 4
  test("4. Should NOT be valid (invalid signature)", () => {
    const txInput = new TransactionInput({
      amount: -1,
      fromAddress: alice.publicKey,
      previousTx: "abc",
    } as TransactionInput);
    txInput.sign(bob.privateKey);
    expect(txInput.IsValid().sucess).toBeFalsy();
  });

  // Test 5
  test("5. Should NOT be valid (previous tx)", () => {
    const txInput = new TransactionInput({
      amount: 1,
      fromAddress: alice.publicKey,
    } as TransactionInput);
    txInput.sign(alice.privateKey);
    expect(txInput.IsValid().sucess).toBeFalsy();
  });

  // Test 6
  test("6. Should NOT be valid (defaults)", () => {
    const txInput = new TransactionInput({} as TransactionInput);
    txInput.sign(alice.privateKey);
    expect(txInput.IsValid().sucess).toBeFalsy();
  });

  // Test 7
  test("7. Should create from TXO", () => {
    const txi = TransactionInput.fromTxo({
      amount: 10,
      toAddress: alice.publicKey,
      tx: exampleTx,
    } as transactionOutput);
    txi.sign(alice.privateKey);

    txi.amount = 11;
    const result = txi.IsValid();
    expect(result.sucess).toBeFalsy();
  });
});
