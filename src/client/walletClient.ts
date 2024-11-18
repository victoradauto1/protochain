import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import readline from "readline";
import Transaction from "../lib/transaction";
import TransactionInput from "../lib/transactionInput";
import transactionOutput from "../lib/transactionOutput";
import TransactionType from "../lib/transactionType";
import Wallet from "../lib/wallet";

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;

let myWalletPub = "";
let myWalletPri = "";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function menu() {
  setTimeout(() => {
    console.clear();
    if (myWalletPub) {
      console.log(`You´re logged at ${myWalletPub}`);
    } else {
      console.log(`You´re not logged.`);
    }

    console.log("1 - Create Wallet");
    console.log("2 - Recover Wallet");
    console.log("3 - Balance");
    console.log("4 - Send tx");
    console.log("5 - Search tx");
    if (myWalletPub) console.log("6 - logOut");

    rl.question("Choose your option: ", (answer) => {
      switch (answer) {
        case "1":
          createWallet();
          break;
        case "2":
          recoverWallet();
          break;
        case "3":
          getBalance();
          break;
        case "4":
          sendTx();
          break;
        case "5":
          searchTx();
          break;
        case "6":
          logOut();
          menu();
          break;
        default: {
          setTimeout(() => {
            console.log("Wrong option!");
          }, 1000);
          menu();
        }
      }
    });
  }, 1000);
}

function preMenu() {
  return rl.question("Press any key to continue...", () => {
    menu();
  });
}

function logOut() {
  myWalletPri = "";
  myWalletPub = "";
}

function createWallet() {
  console.clear();
  const wallet = new Wallet();
  console.log(`You´re new wallet:`);
  console.log(wallet);

  myWalletPub = wallet.publicKey;
  myWalletPri = wallet.privateKey;

  preMenu();
}

function recoverWallet() {
  console.clear();
  rl.question("what is your private key or WIF?", (wifOrPrivateKey) => {
    const wallet = new Wallet();
    console.log(`You´re recovery wallet:`);
    console.log(wallet);

    myWalletPub = wallet.publicKey;
    myWalletPri = wallet.privateKey;
    preMenu();
  });
}

function getBalance() {
  console.clear();

  if (!myWalletPub) {
    console.log("Ypu don´t have a wallet yet.");
    preMenu();
    return;
  }

  //TODO: Get Balance via API
  preMenu();
}

function sendTx() {
  console.clear();

  if (!myWalletPub) {
    console.log("Ypu don´t have a wallet yet.");
    preMenu();
    return;
  }

  console.log(`Your wallet is ${myWalletPub}`);
  rl.question(`To wallet: `, (toWallet) => {
    if (toWallet.length < 66) {
      console.log(`Invalid wallet.`);
      preMenu();
      return;
    }

    rl.question(`Amount: `, async (strAmount) => {
      const amount = parseInt(strAmount);
      if (!amount) {
        console.log(`Invalid amount.`);
        preMenu();
        return;
      }

      const walletResponse = await axios.get(
        `${BLOCKCHAIN_SERVER}wallets/${myWalletPub}`
      );
      const balance = walletResponse.data.balance as number;
      const fee = walletResponse.data.fee as number;
      const utxo = walletResponse.data.utxo as transactionOutput[];

      if (balance < amount + fee) {
        console.log("Insufficient balance (tx + fee).");
        preMenu();
      }

      const tx = new Transaction();
      tx.timestamp = Date.now();
      tx.txOutputs = [
        new transactionOutput({
          toAddress: toWallet,
          amount,
        } as transactionOutput),
      ];

      tx.type = TransactionType.REGULAR;
      tx.txInputs = [
        new TransactionInput({
          amount,
          fromAddress: myWalletPub,
          previousTx: utxo[0].tx
        } as TransactionInput),
      ];

      tx.txInputs[0].sign(myWalletPri);
      tx.hash = tx.getHash();
      tx.txOutputs[0].tx = tx.hash;

      try {
        const txResponse = await axios.post(
          `${BLOCKCHAIN_SERVER}transactions/`,
          tx
        );
        console.log(`Transaction accepted. Waiting the miners!`);
        console.log(txResponse.data.hash);
      } catch (error: any) {
        console.error(error.response ? error.response.data : error.message);
      }

      preMenu();
    });
  });
}

function searchTx() {
  console.clear();
  rl.question(`Your tx hash: `, async (hash) => {
    const response = await axios.get(
      `${BLOCKCHAIN_SERVER}transactions/${hash}`
    );
    console.log(response.data);
    return preMenu();
  });
}

menu();
