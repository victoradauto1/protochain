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

  test("should has genesis block", () => {
    const blockchain = new Blockchain(alice.publicKey);
    expect(blockchain.blocks.length).toEqual(1);
  });

  test("should be valid (the entire blockchain)", () => {
    const blockchain = new Blockchain(alice.publicKey);
    expect(blockchain.isValid()).toBeTruthy();
  });

  test("should be valid (Two blocks)", () => {
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

  test("should NOT be valid (Two blocks)", () => {
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

  test("should add transaction", () => {
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

  test("should NOT add transaction (invalid tx)", () => {
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

  test("should NOT add transaction (duplicated tx in blockchain)", () => {
    const blockchain = new Blockchain(alice.publicKey);
    const tx = blockchain.blocks[0].transactions[0];
    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toBeFalsy();
  });

  test("should get Transactions (mempool)", () => {
    const blockchain = new Blockchain(alice.publicKey);

    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      hash: "xyz",
    } as Transaction);

    blockchain.mempool.push(tx);
    const search = blockchain.getTransaction(tx.hash);
    expect(search.mempoolIndex).toEqual(0);
  });

  test("should get Transactions (blockchain)", () => {
    const blockchain = new Blockchain(alice.publicKey);

    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      hash: "xyz",
    } as Transaction);

    const block = new Block({
      index: 1,
      previousHash: blockchain.blocks[0].hash,
      transactions: [tx],
    } as Block);

    blockchain.blocks.push(block);

    const result = blockchain.getTransaction(tx.hash);
    expect(result.blockIndex).toEqual(1);
  });

  test("should NOT get Transactions", () => {
    const blockchain = new Blockchain(alice.publicKey);

    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      hash: "abc",
    } as Transaction);

    const block = new Block({
      index: 1,
      previousHash: blockchain.blocks[0].hash,
      transactions: [tx],
    } as Block);

    blockchain.blocks.push(block);

    const result = blockchain.getTransaction("xyz");
    expect(result.blockIndex).toEqual(-1);
    expect(result.mempoolIndex).toEqual(-1);
  });

  test("should get block", () => {
    const blockchain = new Blockchain(alice.publicKey);
    const block = blockchain.getBlock(blockchain.blocks[0].hash);
    expect(block).toBeTruthy();
  });

  test("should add block", () => {
    const blockchain = new Blockchain(alice.publicKey);

    const tx = new Transaction({
      txInputs: [new TransactionInput()],
    } as Transaction);

    blockchain.mempool.push(tx);

    const block = new Block({
      index: 1,
      previousHash: blockchain.blocks[0].hash,
      transactions: [tx],
    } as Block);

    const result = blockchain.addBlock(block);
    expect(result.sucess).toBeTruthy();
  });

  test("should NOT add block (Invalid mempool)", () => {
    const blockchain = new Blockchain(alice.publicKey);
    blockchain.mempool.push(new Transaction());
    blockchain.mempool.push(new Transaction());

    const tx = new Transaction({
      txInputs: [new TransactionInput()],
    } as Transaction);

    const result = blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [tx],
      } as Block)
    );

    expect(result.sucess).toBeFalsy();
  });

  test("should NOT add block (Invalid index)", () => {
    const blockchain = new Blockchain(alice.publicKey);
    blockchain.mempool.push(new Transaction());
    const block = new Block({
      index: -1,
      previousHash: blockchain.blocks[0].hash,
    } as Block);

    block.transactions.push(
      new Transaction({
        type: TransactionType.FEE,
        txOutputs: [
          new transactionOutput({
            toAddress: alice.publicKey,
            amount: 1,
          } as transactionOutput),
        ],
      } as Transaction)
    );

    block.hash = block.getHash();

    const result = blockchain.addBlock(block);
    expect(result.sucess).toBeFalsy();
  });

  test("Should get next block info", () => {
    const blockchain = new Blockchain(alice.publicKey);
    blockchain.mempool.push(new Transaction());
    const info = blockchain.getNextBlock();
    expect(info ? info.index : 0).toEqual(1);
  });

  test("Should NOT get next block info", () => {
    const blockchain = new Blockchain(alice.publicKey);
    const info = blockchain.getNextBlock();
    expect(info).toBeNull();
  });

  test("Should NOT add transaction (pending tx)", () => {
    const blockchain = new Blockchain(alice.publicKey);

    const tx = new Transaction();
    tx.hash = "tx";
    tx.txInputs = [
      new TransactionInput({
        amount: 10,
        fromAddress: alice.publicKey,
        previousTx: "abc",
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
  });

  test("Should get balance", () => {
    const blockchain = new Blockchain(alice.publicKey);
    const balance = blockchain.getBalance(alice.publicKey);
    expect(balance).toBeGreaterThan(0);
  });

  test("Should get balance equal to zero", () => {
    const blockchain = new Blockchain(alice.publicKey);
    const txo = blockchain.blocks[0].transactions[0];

    const tx = new Transaction();
    tx.hash = 'tx';
    tx.txInputs = [new TransactionInput({
      amount:10,
      fromAddress:alice.publicKey,
      previousTx: txo.hash,
      signature: 'abc'
    } as TransactionInput)];

    tx.txOutputs = [new transactionOutput({
      amount: 5,
      toAddress: 'abc'
    } as transactionOutput),
    new transactionOutput({
      amount: 4,
      toAddress: alice.publicKey
    } as transactionOutput)];

    blockchain.blocks.push(new Block({
      index:1,
      transactions:[tx]
    } as Block))

    const balance = blockchain.getBalance(bob.publicKey);
    expect(balance).toEqual(0);
  });

  test("Should get UTXO", () => {
    const blockchain = new Blockchain(alice.publicKey);
    const utxo = blockchain.getUtxo(alice.publicKey);
    expect(utxo).toEqual(0);
  });

  test("should NOT add transaction(Invalid UTXO)", () => {
    const blockchain = new Blockchain(alice.publicKey);

    const tx = new Transaction();
    tx.hash = "tx";
    tx.txInputs = [
      new TransactionInput({
        amount: 10,
        previousTx: 'wrong',
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
    expect(validation.sucess).toBeFalsy();
  });
});
