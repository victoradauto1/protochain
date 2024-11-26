import { jest } from "@jest/globals";
import Block from "../src/lib/block";
import Blockchain from "../src/lib/blockchain";
import Transaction from "../src/lib/transaction";
import TransactionInput from "../src/lib/transactionInput";
import transactionOutput from "../src/lib/transactionOutput";
import TransactionType from "../src/lib/transactionType";
import Wallet from "../src/lib/wallet";

jest.mock("../src/lib/block");
jest.mock("../src/lib/transaction");
jest.mock("../src/lib/transactionInput");

describe("Blockchain tests", () => {
  let alice: Wallet, bob: Wallet;

  beforeAll(() => {
    alice = new Wallet();
    bob = new Wallet();
  });

  // 1. Verifica se existe o bloco gênese
  test("1. should has genesis block", () => {
    const blockchain = new Blockchain(alice.publicKey);
    expect(blockchain.blocks.length).toEqual(1);
  });

  // 2. Verifica a validade de toda a blockchain
  test("2. should be valid (the entire blockchain)", () => {
    const blockchain = new Blockchain(alice.publicKey);
    expect(blockchain.isValid()).toBeTruthy();
  });

  // 3. Verifica a validade de uma blockchain com dois blocos
  test("3. should be valid (Two blocks)", () => {
    const blockchain = new Blockchain(alice.publicKey);
    const tx1 = new Transaction({
      txInputs: [new TransactionInput()],
    } as Transaction);
    const tx2 = new Transaction({
      txInputs: [new TransactionInput()],
    } as Transaction);

    blockchain.mempool.push(tx1, tx2);
    const result = blockchain.addBlock(
      new Block({
        index: 0,
        previousHash: blockchain.blocks[0].hash,
        transactions: [tx1],
        hash: "abc",
      } as Block)
    );
    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: "abc",
        transactions: [tx2],
      } as Block)
    );
    expect(result.sucess).toBeFalsy();
  });

  // 4. Verifica a invalidade de uma blockchain com dois blocos
  test("4. should NOT be valid (Two blocks)", () => {
    const blockchain = new Blockchain(alice.publicKey);
    const tx1 = new Transaction({
      txInputs: [new TransactionInput()],
    } as Transaction);
    const tx2 = new Transaction({
      txInputs: [new TransactionInput()],
    } as Transaction);

    blockchain.mempool.push(tx1, tx2);
    const result = blockchain.addBlock(
      new Block({
        index: 0,
        previousHash: blockchain.blocks[0].hash,
        transactions: [tx1],
        hash: "abc",
      } as Block)
    );
    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: "errado",
        transactions: [tx2],
      } as Block)
    );
    expect(result.sucess).toBeFalsy();
  });

  // 5. Verifica se adiciona uma transação
  test("5. should add transaction", () => {
    const blockchain = new Blockchain(alice.publicKey);
    const txo = blockchain.blocks[0].transactions[0];

    const tx = new Transaction();
    tx.hash = "tx";
    tx.txInputs = [
      new TransactionInput({
        amount: 10,
        previousTx: txo.hash,
        fromAddress: alice.publicKey,
        signature: "abc",
      } as TransactionInput),
    ];

    tx.txOutputs = [
      new transactionOutput({
        amount: 10,
        toAddress: "abc",
      } as transactionOutput),
    ];

    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toBeTruthy();
  });

  // 6. Verifica se NÃO adiciona uma transação (transação inválida)
  test("6. should NOT add transaction (invalid tx)", () => {
    const blockchain = new Blockchain(alice.publicKey);
    const txo = blockchain.blocks[0].transactions[0];

    const tx = new Transaction();
    tx.hash = "tx";
    tx.timestamp = -1;
    tx.txInputs = [
      new TransactionInput({
        amount: 10,
        fromAddress: alice.publicKey,
        previousTx: txo.hash,
        signature: "xyz",
      } as TransactionInput),
    ];

    tx.txOutputs = [new transactionOutput({
      amount: 10,
      toAddress: 'abc'
    } as transactionOutput)];

    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toBeFalsy();
  });

  // 7. Verifica se NÃO adiciona uma transação (pendente na mempool)
  test("7. should NOT add transaction (pending transaction)", () => {
    const blockchain = new Blockchain(alice.publicKey);
    const txo = blockchain.blocks[0].transactions[0];

    const tx = new Transaction();
    tx.hash = "tx";
    tx.txInputs = [
      new TransactionInput({
        amount: 10,
        fromAddress: alice.publicKey,
        previousTx: txo.hash,
        signature: "xyz",
      } as TransactionInput),
    ];

    tx.txOutputs = [new transactionOutput({
      amount: 10,
      toAddress: 'abc'
    } as transactionOutput)];

    blockchain.mempool.push(tx);

    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toBeFalsy();
    expect(validation.message).toBe("This wallet has a pending transaction.")
  });

  // 8. Verifica se NÃO adiciona uma transação (UTXO já gasto ou inexistente)
  test("8. should NOT add transaction (spent UTXO or non-existent)", () => {
    const blockchain = new Blockchain(alice.publicKey);
 
    const tx = new Transaction();
    tx.hash = "tx";

    tx.txInputs = [new TransactionInput(
      {
        previousTx: "nonexistent-tx-id", 
        amount: 10,
      }as TransactionInput
    )];

    tx.txOutputs = [new transactionOutput({
      amount: 10,
      toAddress: 'abc'
    } as transactionOutput)];


    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toBeFalsy();
    expect(validation.message).toBe("Invalid Tx: the TXO is already spent or unexistent.")
  });
});
