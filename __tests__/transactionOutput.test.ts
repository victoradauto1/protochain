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
});
