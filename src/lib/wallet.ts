import ECPairFactory from "ecpair";
import * as ecc from "tiny-secp256k1";

const ECPair = ECPairFactory(ecc);

/**
 * Wallet Class
 */
export default class Wallet {
  privateKey = "";
  publicKey = "";

  constructor(wifOrWalletKey?: string) {
    let keys;

    if (wifOrWalletKey) {
      if (wifOrWalletKey.length === 64) {
        keys = ECPair.fromPrivateKey(Buffer.from(wifOrWalletKey, "hex"));
      } else {
        keys = ECPair.fromWIF(wifOrWalletKey);
      }
    } else {
      keys = ECPair.makeRandom();
    }

    /* c8 ignore start */
    this.privateKey = keys.privateKey
      ? Buffer.from(keys.privateKey).toString("hex")
      : "";
    this.publicKey = keys.publicKey
      ? Buffer.from(keys.publicKey).toString("hex")
      : "";
       /* c8 ignore stop */
  }
}
