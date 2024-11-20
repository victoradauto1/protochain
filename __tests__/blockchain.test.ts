import { jest } from "@jest/globals";
import Block from "../src/lib/block";
import Blockchain from "../src/lib/blockchain";
import Transaction from "../src/lib/transaction";
import TransactionInput from "../src/lib/transactionInput";
import Wallet from "../src/lib/wallet";

jest.mock("../src/lib/block");
jest.mock("../src/lib/transaction");
jest.mock("../src/lib/transactionInput");

describe("Blockchain tests", () => {

  let alice: Wallet;

  beforeAll(()=>{
    alice = new Wallet();
  })

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

    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      hash: "xyz",
    } as Transaction);

    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toBeTruthy();
  });

  test("should NOT add transaction (invalid tx)", () => {
    const blockchain = new Blockchain(alice.publicKey);

    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      hash: "abc",
      timestamp: -1
    } as Transaction);

    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toBeFalsy();
  });

  
  test("should NOT add transaction (duplicated tx in blockchain)", () => {
    const blockchain = new Blockchain(alice.publicKey);

    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      hash: "xyz",
    } as Transaction);

    blockchain.blocks.push(new Block({
      transactions: [tx]
    } as Block))

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
    expect(result.sucess).toBeFalsy();
  });
  

  test("should NOT add block", () => {
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
    console.log(result);
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

  test("Should NOT add transaction (pending tx)", ()=>{
    const blockchain = new Blockchain(alice.publicKey);

    const tx = new Transaction({
      txInputs:[ new TransactionInput()],
      hash: "abc"
    } as Transaction);

    const tx2 = new Transaction({
      txInputs:[ new TransactionInput()],
      hash: "abc2"
    } as Transaction)


    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toBeFalsy();
  })
});
