import Wallet from "../src/lib/wallet";
import transactionOutput from "../src/lib/transactionOutput";

describe("TransactionOutput tests", () => {
  let alice: Wallet;
  let bob: Wallet;

  beforeAll(() => {
    alice = new Wallet();
    bob =  new Wallet();
  });

  test("1 - Should be valid", () => {
    const txOutput = new transactionOutput({
        amount: 10,
        toAddress: alice.publicKey,
        tx: "abc"
    } as transactionOutput);

    const valid =  txOutput.isValid();
    expect(valid.sucess).toBeTruthy()
  });

  test("2 - Should NOT be valid (default values -  fall back)", () => {
    const txOutput = new transactionOutput();
    const valid =  txOutput.isValid();
    expect(valid.sucess).toBeFalsy()
  });

  test("3 - Should Not be valid", () => {
    const txOutput = new transactionOutput({
        amount: -10,
        toAddress: alice.publicKey,
        tx: "abc"
    } as transactionOutput);

    const valid =  txOutput.isValid();
    expect(valid.sucess).toBeFalsy()
  });

  test("4 - Should get hash", () => {
    const txOutput = new transactionOutput({
        amount: 10,
        toAddress: alice.publicKey,
        tx: "abc"
    } as transactionOutput);
    const hash = txOutput.getHash();
    expect(hash).toBeTruthy()
  });
});
