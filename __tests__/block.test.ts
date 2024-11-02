import Block from "../src/lib/block";
import BlockInfo from "../src/lib/blockInfo";
import Transaction from "../src/lib/transaction";
import TransactionType from "../src/lib/transactionType";

const exampleDifficulty = 0;
const exampleMiner = "wallet";
let genesis: Block;

jest.mock('../src/lib/transaction')

beforeAll(() => {
  genesis = new Block({
    transactions: [
      new Transaction({
        data: "Genesis Block",
      } as Transaction),
    ],
  } as Block);
});

describe("Block tests", () => {
  test("should be valid", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          data: "Block 2",
        } as Transaction),
      ],
    } as Block);
    block.mine(exampleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeTruthy();
  });

  test("should be NOT valid (2 FEE)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          type: TransactionType.FEE,
          data: "fee 1",
        } as Transaction),
        new Transaction({
          type: TransactionType.FEE,
          data: "fee 2",
        } as Transaction)
      ],
    } as Block);
    block.mine(exampleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("should be NOT valid (Invalid tx)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({} as Transaction)
      ],
    } as Block);
    block.mine(exampleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("should create from blockInfo", () => {
    const block = Block.fromBlockInfo({
      transactions: [
        new Transaction({
          data: "Block 2",
        } as Transaction),
      ],
      difficulty: exampleDifficulty,
      feePerTx: 1,
      index: 1,
      maxDifficulty: 62,
      previousHash: genesis.hash,
    } as BlockInfo);
    block.mine(exampleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeTruthy();
  });

  test("should be NOT valid (fall backs)", () => {
    const block = new Block();
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("should be NOT valid(index)", () => {
    const block = new Block({
      index: -1,
      transactions: [
        new Transaction({
          data: "Block 2",
        } as Transaction),
      ],
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("should be NOT valid( empty hash)", () => {
    const block = new Block({
      index: 1,
      transactions: [
        new Transaction({
          data: "Block 2",
        } as Transaction),
      ],
    } as Block);
    block.mine(exampleDifficulty, exampleMiner);
    block.hash = "";
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("should be NOT valid( not mined)", () => {
    const block = new Block({
      index: 1,
      transactions: [
        new Transaction({
          data: "Block 2",
        } as Transaction),
      ],
    } as Block);
    block.hash = "";
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("should be NOT valid( previous hash)", () => {
    const block = new Block({
      index: 1,
      transactions: [
        new Transaction({
          data: "Block 2",
        } as Transaction),
      ],
    } as Block);
    block.previousHash = "";
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("should be NOT valid( invalid previous hash)", () => {
    const block = new Block({
      index: 1,
      transactions: [
        new Transaction({
          data: "Block 2",
        } as Transaction),
      ],
    } as Block);
    const valid = block.isValid(
      "invalid hash",
      genesis.index,
      exampleDifficulty
    );
    expect(valid.sucess).toBeFalsy();
  });

  test("should be NOT valid(timestamp)", () => {
    const block = new Block({
      index: 1,
      transactions: [
        new Transaction({
          data: "Block 2",
        } as Transaction),
      ],
    } as Block);
    block.timestamp = 0;
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("should be NOT valid(data)", () => {
    const block = new Block({
      index: 1,
      transactions: [
        new Transaction({
          data: "",
        } as Transaction),
      ],
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });
});
