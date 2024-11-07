import TransactionInput from "../src/lib/transactionInput";
import Wallet from "../src/lib/wallet";

describe("TransactionInput tests", () => {

    let alice: Wallet;
 
  test("Should be valid", () => {
    const wallet = new Wallet();
    expect(wallet.privateKey).toBeTruthy();
    expect(wallet.publicKey).toBeTruthy();
  });

  test("Should recovery wallet (PK)", () => {
    const wallet = new Wallet();
    expect(wallet.privateKey).toBeTruthy();
    expect(wallet.publicKey).toBeTruthy();
  });

  test("Should be valid", () => {
    const wallet = new Wallet();
    expect(wallet.privateKey).toBeTruthy();
    expect(wallet.publicKey).toBeTruthy();
  });
});

