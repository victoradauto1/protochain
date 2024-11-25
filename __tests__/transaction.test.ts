import Transaction from "../src/lib/transaction";
import TransactionInput from "../src/lib/transactionInput";
import transactionOutput from "../src/lib/transactionOutput";
import TransactionType from "../src/lib/transactionType";
import Wallet from "../src/lib/wallet";

jest.mock("../src/lib/transactionInput");
jest.mock("../src/lib/transactionOutput");

describe("Transaction test", () => {

  const exampleDifficulty: number = 1;
  const exampleFee: number = 1;
  const exampleTx: string =
  "4885d8f8ee0452d2d97a475028c124e13e8b1e716545857e8b0bd72f70fbe2ea";
  let alice: Wallet, bob: Wallet;

  beforeAll(()=>{
    alice = new Wallet();
    bob = new Wallet();
  })

  test("should be valid (FEE)", () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new transactionOutput()],
      type: TransactionType.FEE,
    } as Transaction);

    tx.txInputs = undefined;
    tx.hash = tx.getHash();

    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(valid.sucess).toBeTruthy();
  });

  test("should be valid (REGULAR default)", () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new transactionOutput()],
      type: TransactionType.REGULAR,
    } as Transaction);

    tx.txInputs = undefined;
    tx.hash = tx.getHash();

    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(valid.sucess).toBeTruthy();
  });

  test("should NOT be valid (txo hash !== tx hash)", () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new transactionOutput()],
    } as Transaction);

    tx.txOutputs[0].tx = "olele";

    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(valid.sucess).toBeTruthy();
  });

  test("should be valid (tx inputs < tx outputs)", () => {
    const tx = new Transaction({
      txInputs: [
        new TransactionInput({
          amount: 1,
        } as TransactionInput),
      ],
      txOutputs: [
        new transactionOutput({
          amount: 2,
        } as transactionOutput),
      ],
      type: TransactionType.REGULAR,
    } as Transaction);

    tx.txInputs = undefined;
    tx.hash = tx.getHash();

    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(valid.sucess).toBeFalsy();
  });

  test("should be valid (REGULAR with params Invalid Hash)", () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new transactionOutput()],
      type: TransactionType.REGULAR,
      timestamp: Date.now(),
      hash: "abc",
    } as Transaction);
    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(valid.sucess).toBeFalsy();
  });

  test("should NOT be valid (Invalid Hash)", () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new transactionOutput()],
      hash: "abc",
    } as Transaction);
    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(valid.sucess).toBeFalsy();
  });

  test("should NOT be valid (Invalid to)", () => {
    const tx = new Transaction();
    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(valid.sucess).toBeFalsy();
  });

  test("should NOT be valid (Invalid txInput)", () => {
    const tx = new Transaction({
      txOutputs: [new transactionOutput()],
      txInputs: [
        new TransactionInput({
          amount: -10,
          fromAddress: "From",
          signature: "abc",
        } as TransactionInput),
      ],
    } as Transaction);
    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(valid.sucess).toBeFalsy();
  });

  test("Should get fee", ()=>{
    const txIn = new TransactionInput({
      amount: 11,
      fromAddress: alice.publicKey,
      previousTx: exampleTx
    } as TransactionInput);
    txIn.sign(alice.privateKey);

    const txOut =  new transactionOutput({
      amount: 10,
      toAddress: bob.publicKey
    }as transactionOutput);

    const tx = new Transaction({
      txInputs:[txIn],
      txOutputs:[txOut]
    } as Transaction);

    const result = tx.getFee();
    expect(result).toBeGreaterThan(0);
  });

  test("Should get zero fee", ()=>{
    const tx = new Transaction();
    tx.txInputs =  undefined;

    const result = tx.getFee();
    expect(result).toEqual(0);
  });

  test("Should create from reward", ()=>{
    const tx = Transaction.fromReward({
      amount:10,
      toAddress: alice.publicKey,
      tx: exampleTx
    } as transactionOutput);

    const result = tx.isValid(exampleDifficulty, exampleFee);
    expect(result.sucess).toBeTruthy();
  });

  test("Should NOT be valid (fee excess)", ()=>{
     const txOut = new transactionOutput({
      amount: Number.MAX_VALUE,
      toAddress: bob.publicKey
    }as transactionOutput);

    const tx = new Transaction({
      type: TransactionType.FEE,
      txOutputs:[txOut]
    } as Transaction)

    const result = tx.isValid(exampleDifficulty, exampleFee);
    expect(result.sucess).toBeFalsy();
  });

});
