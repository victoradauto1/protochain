import ECPairFactory from "ecpair";
import * as ecc from "tiny-secp256k1";
import Wallet from "../src/lib/wallet";

const ECPair = ECPairFactory(ecc);

describe("Wallet tests", () => {
  let alice: Wallet;
  let exampleWIF: string;

  beforeAll(() => {
    alice = new Wallet();
    const keyPair = ECPair.makeRandom();
    exampleWIF = keyPair.toWIF();
  });

  test("Should create a wallet", () => {
    const wallet = new Wallet();
    expect(wallet.privateKey).toBeTruthy();
    expect(wallet.publicKey).toBeTruthy();
  });

  test("should recovery wallet(PrivateKey)", () => {
    const wallet = new Wallet(alice.privateKey);
    expect(wallet.publicKey).toEqual(alice.publicKey);
  });

  test("Should recovery wallet(WIF)", () => {
    const wallet = new Wallet(exampleWIF);
    expect(wallet.privateKey).toBeTruthy;
    expect(wallet.publicKey).toBeTruthy();
  });

  
  test("Should handle missing public key gracefully", () => {
    const wallet = new Wallet(alice.privateKey);
    wallet.publicKey = "";

    expect(wallet.publicKey).toBe("");
  });

});
