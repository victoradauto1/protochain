import Block from "../src/lib/block";
import BlockInfo from "../src/lib/blockInfo";
import Transaction from "../src/lib/transaction";
import TransactionInput from "../src/lib/transactionInput";
import TransactionType from "../src/lib/transactionType";

const exampleDifficulty = 0;
const exampleMiner = "wallet";
let genesis: Block;

jest.mock("../src/lib/transaction");
jest.mock("../src/lib/transactionInput");

beforeAll(() => {
  genesis = new Block({
    transactions: [
      new Transaction({
        txInput: new TransactionInput(),
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
          txInput: new TransactionInput(),
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
          txInput: new TransactionInput(),
        } as Transaction),
        new Transaction({
          type: TransactionType.FEE,
          txInput: new TransactionInput(),
        } as Transaction),
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
      transactions: [new Transaction({} as Transaction)],
    } as Block);
    block.mine(exampleDifficulty, exampleMiner);
    block.transactions[0].to = "";
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("should create from blockInfo", () => {
    const block = Block.fromBlockInfo({
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
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
          txInput: new TransactionInput(),
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
          txInput: new TransactionInput(),
        } as Transaction),
      ],
    } as Block);
    block.mine(exampleDifficulty, exampleMiner);
    block.hash = "";
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("should be NOT valid (block not mined)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
        } as Transaction),
      ],
    } as Block);

    block.previousHash = genesis.hash; // Previous hash correto
    block.nonce = 0; // Nonce inválido
    block.miner = ""; // Miner inválido

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
    expect(valid.message).toBe("No mined");
  });

  test("should be NOT valid( previous hash)", () => {
    const block = new Block({
      index: 1,
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
        } as Transaction),
      ],
    } as Block);
    block.previousHash = "";
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("should be NOT valid (invalid hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
        } as Transaction),
      ],
    } as Block);
    // Mineramos o bloco para obter um hash válido.
    block.mine(exampleDifficulty, exampleMiner);
    // Alteramos o hash para simular um hash inválido.
    block.hash = "invalid_hash";

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
    expect(valid.message).toBe("Invalid hash");
  });

  test("should be NOT valid(timestamp)", () => {
    const block = new Block({
      index: 1,
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
        } as Transaction),
      ],
    } as Block);
    block.timestamp = 0;
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("should be NOT valid(tx Invalid)", () => {
    const txInput = new TransactionInput();
  
    const block = new Block({
      index: 1,
      transactions: [
        new Transaction({
          txInput,
        } as Transaction),
      ],
    } as Block);
    block.mine(exampleDifficulty, exampleMiner);

    block.transactions[0].to="";

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });
});
