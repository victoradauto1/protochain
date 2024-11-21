import Block from "../src/lib/block";
import BlockInfo from "../src/lib/blockInfo";
import Transaction from "../src/lib/transaction";
import TransactionInput from "../src/lib/transactionInput";
import transactionOutput from "../src/lib/transactionOutput";
import TransactionType from "../src/lib/transactionType";
import Wallet from "../src/lib/wallet";

jest.mock("../src/lib/transaction");
jest.mock("../src/lib/transactionInput");
jest.mock("../src/lib/transactionOutput");

const exampleDifficulty = 1;
let genesis: Block;
let alice: Wallet;

beforeAll(() => {

  alice = new Wallet();

  genesis = new Block({
    transactions: [
      new Transaction({
        txInputs: [new TransactionInput()],
      } as Transaction),
    ],
  } as Block);
});

describe("Block tests", () => {

  test("1 - should create from blockInfo", () => {
    const block = Block.fromBlockInfo({
      transactions: [],
      difficulty: exampleDifficulty,
      feePerTx: 1,
      index: 1,
      maxDifficulty: 62,
      previousHash: genesis.hash,
    } as BlockInfo);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new transactionOutput({
        toAddress: alice.publicKey,
        amount: 1
      } as transactionOutput)]
    } as Transaction))

    block.hash = block.getHash();

    block.mine(exampleDifficulty, alice.publicKey);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeTruthy();
  });

  test("2 - should be valid", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [] as Transaction[],
    } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new transactionOutput({
        toAddress: alice.publicKey,
        amount: 1
      } as transactionOutput)]
    } as Transaction))

    block.hash = block.getHash();

    block.mine(exampleDifficulty, alice.publicKey);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeTruthy();
  });

 
  test("3 - should NOT be valid (no fee)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInputs: [new TransactionInput()],
        } as Transaction),
      ],
    } as Block);

    block.mine(exampleDifficulty, alice.publicKey);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("4 - should be NOT valid (2 FEE)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          type: TransactionType.FEE,
          txInputs: [new TransactionInput()],
        } as Transaction),
        new Transaction({
          type: TransactionType.FEE,
          txInputs: [new TransactionInput()],
        } as Transaction),
      ],
    } as Block);
    block.mine(exampleDifficulty, alice.publicKey);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("5 - should be NOT valid (Invalid tx)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [] as Transaction[],
    } as Block);
    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      timestamp: -1,
      txOutputs: [new transactionOutput({
        toAddress: alice.publicKey,
        amount:1
      } as transactionOutput)]
    } as Transaction))

    block.hash = block.getHash();
    block.mine(exampleDifficulty, alice.publicKey);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("6 - should be NOT valid (Invalid index)", () => {
    const block = new Block({
      index: -1,
      transactions: [] as Transaction[],
    } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new transactionOutput({
        toAddress: alice.publicKey,
        amount: 1
      } as transactionOutput)]
    } as Transaction));

    block.hash = block.getHash();
    block.mine(exampleDifficulty, alice.publicKey);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("7 - should be NOT valid (block not mined)", () => {
    const block = new Block({
      index: 1,
      nonce: 0,
      previousHash: genesis.hash,
      transactions: [] as Transaction[],
    } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new transactionOutput({
        toAddress: alice.publicKey,
        amount: 1
      } as transactionOutput)]
    } as Transaction))

    block.hash = block.getHash();
    block.previousHash = genesis.hash; 

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
    expect(valid.message).toBe("No mined");
  });

  test("8 - should be NOT valid (invalid hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInputs: [new TransactionInput()],
        } as Transaction),
      ],
    } as Block);
   
    block.mine(exampleDifficulty, alice.publicKey);

    block.hash = "invalid_hash";

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
    expect(valid.message).toBe("Invalid hash");
  });

  test("9 - should be NOT valid (invalid previousHash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [] as Transaction[],
    } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs:[new transactionOutput({
        toAddress: alice.publicKey,
        amount: 1
      } as transactionOutput)]
    } as Transaction))
   
    block.hash = block.getHash();
    block.mine(exampleDifficulty, alice.publicKey);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("10 - should be NOT valid (invalid timestamp)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [] as Transaction[],
    } as Block);

    block.timestamp = -1;

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs:[new transactionOutput({
        toAddress: alice.publicKey,
        amount: 1
      } as transactionOutput)]
    } as Transaction))
   
    block.hash = block.getHash();
    block.mine(exampleDifficulty, alice.publicKey);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("11 - should NOT be valid (different hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [] as Transaction[],
    } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new transactionOutput({
        toAddress: alice.publicKey,
        amount: 1
      } as transactionOutput)]
    } as Transaction))

    block.hash = block.getHash();
    block.mine(exampleDifficulty, alice.publicKey);

    block.hash = 'abc';

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });
});
