import Block from "../src/lib/block";
import Blockchain from "../src/lib/blockchain";
import { jest } from "@jest/globals";
import Transaction from "../src/lib/transaction";

jest.mock("../src/lib/block")
jest.mock('../src/lib/transaction')

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
    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [new Transaction({
          data: "Block 2"
        } as Transaction)],
      } as Block)
    );
    expect(blockchain.isValid().sucess).toBeTruthy();
  });

  test("should be NOT valid (Two blocks)", () => {
    const blockchain = new Blockchain();
    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [new Transaction({
          data: "Block 2"
        } as Transaction)],
      } as Block)
    );
    blockchain.blocks[1].index = -1;
    expect(blockchain.isValid().sucess).toBeFalsy();
  });

  test("should get block", () => {
    const blockchain = new Blockchain();
    const block = blockchain.getBlock(blockchain.blocks[0].hash);
    expect(block).toBeTruthy();
  });

  test("should add block", () => {
    const blockchain = new Blockchain();
    const result = blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [new Transaction({
          data: "Block 2"
        } as Transaction)],
      } as Block)
    );
    expect(result.sucess).toBeTruthy();
  });

  test("should NOT add block", () => {
    const blockchain = new Blockchain();
    const block = new Block({
      index: -1,
      previousHash: blockchain.blocks[0].hash,
      transactions: [new Transaction({
        data: "Block 2"
      } as Transaction)],
    } as Block);
    const result = blockchain.addBlock(block);
    expect(result.sucess).toBeFalsy();
  });

  test('Should get next block info', ()=>{
    const blockchain = new Blockchain();
    const info = blockchain.getNextBlock();
    expect(info.index).toEqual(1);
  })
});
