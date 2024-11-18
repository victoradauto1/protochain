import ECPairFactory from "ecpair";
import * as ecc from "tiny-secp256k1";

const ECPair = ECPairFactory(ecc);

const WIF = "KwDiBf89QgGbjEhKnhXJuH7SUW1Zmwo1UsNfwv5zohWnqzRoK2He"; // Substitua por sua chave WIF
try {
    const keyPair = ECPair.fromWIF(WIF);
    console.log("WIF is valid!");
    console.log("Public Key:", keyPair.publicKey.toString("hex"));
} catch (error) {
    console.error("Invalid WIF:", error.message);
}
