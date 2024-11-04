import { jest } from "@jest/globals";
import Block from "../src/lib/block";
import Blockchain from "../src/lib/blockchain";
import Transaction from "../src/lib/transaction";

jest.mock("../src/lib/block");
jest.mock("../src/lib/transaction");

describe("Blockchain tests", () => {
  test("should has genesis block", () => {
    const blockchain = new Blockchain();
    expect(blockchain.blocks.length).toEqual(1);
  });

  test("should be valid (the entire blockchain)", () => {
    const blockchain = new Blockchain();
    expect(blockchain.isValid()).toBeTruthy();
  });

  test("should be valid (Two blocks)", () => {
    const blockchain = new Blockchain();
    const tx1 = new Transaction({
      data: "tx1",
    } as Transaction);
    const tx2 = new Transaction({
      data: "tx2",
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
    const blockchain = new Blockchain();
    const tx1 = new Transaction({
      data: "tx1",
    } as Transaction);
    const tx2 = new Transaction({
      data: "tx2",
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
    const blockchain = new Blockchain();

    const tx = new Transaction({
      data: "tx1",
      hash: "xyz",
    } as Transaction);

    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toBeTruthy();
  });

  test("should NOT add transaction (invalid tx)", () => {
    const blockchain = new Blockchain();

    const tx = new Transaction({
      data: "",
      hash: "xyz",
    } as Transaction);

    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toBeFalsy();
  });

  test("should NOT add transaction (duplicated tx in blockchain)", () => {
    const blockchain = new Blockchain();

    const tx = new Transaction({
      data: "tx1",
      hash: "xyz",
    } as Transaction);

    blockchain.blocks.push(new Block({
      transactions: [tx]
    } as Block))

    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toBeFalsy();
  });

  test("should NOT add transaction (duplicated tx in mempool)", () => {
    const blockchain = new Blockchain();

    const tx = new Transaction({
      data: "tx1",
      hash: "xyz",
    } as Transaction);

    blockchain.mempool.push(tx)

    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toBeFalsy();
  });

  test("should get Transactions (mempool)", () => {
    const blockchain = new Blockchain();

    const tx = new Transaction({
      data: "tx1",
      hash: "xyz",
    } as Transaction);

    blockchain.mempool.push(tx);
    const search = blockchain.getTransaction(tx.hash);
    expect(search.mempoolIndex).toEqual(0);
  });

  test("should get Transactions (blockchain)", () => {
    const blockchain = new Blockchain();

    const tx = new Transaction({
      data: "tx1",
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
    const blockchain = new Blockchain();

    const tx = new Transaction({
      data: "tx1",
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
    const blockchain = new Blockchain();
    const block = blockchain.getBlock(blockchain.blocks[0].hash);
    expect(block).toBeTruthy();
  });

  test("should add block", () => {
    const blockchain = new Blockchain();

    const tx = new Transaction({
      data: "tx1",
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
    const blockchain = new Blockchain();
    const tx = new Transaction({
      data: "Block 2",
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
    const blockchain = new Blockchain();
    blockchain.mempool.push(new Transaction());
    const info = blockchain.getNextBlock();
    expect(info ? info.index : 0).toEqual(1);
  });

  test("Should NOT get next block info", () => {
    const blockchain = new Blockchain();
    const info = blockchain.getNextBlock();
    expect(info).toBeNull();
  });
});
