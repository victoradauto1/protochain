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

describe("Block tests", () => {
  const exampleDifficulty: number = 1;
  const exampleFee: number = 1;
  const exampleTx: string =
    "4885d8f8ee0452d2d97a475028c124e13e8b1e716545857e8b0bd72f70fbe2ea";
  let genesis: Block;
  let alice: Wallet, bob: Wallet;

  beforeAll(() => {
    alice = new Wallet();
    bob = new Wallet();

    genesis = new Block({
      transactions: [
        new Transaction({
          txInputs: [new TransactionInput()],
        } as Transaction),
      ],
    } as Block);
  });

  function getFullBlock(): Block {
    const txIn = new TransactionInput({
      amount: 10,
      fromAddress: alice.publicKey,
      previousTx: exampleTx,
    } as TransactionInput);
    txIn.sign(alice.privateKey);

    const txOut = new transactionOutput({
      amount: 10,
      toAddress: bob.publicKey,
    } as transactionOutput);

    const tx = new Transaction({
      txInputs: [txIn],
      txOutputs: [txOut],
    } as Transaction);

    const txFee = new Transaction({
      type: TransactionType.FEE,
      txOutputs: [
        new transactionOutput({
          amount: 1,
          toAddress: alice.publicKey,
        } as transactionOutput),
      ],
    } as Transaction);

    const block = new Block({
      index: 1,
      transactions: [tx, txFee],
      previousHash: genesis.hash,
    } as Block);

    block.mine(exampleDifficulty, alice.publicKey);

    return block;
  }

  test("1 - should create from blockInfo", () => {
    const block = Block.fromBlockInfo({
      transactions: [],
      difficulty: exampleDifficulty,
      feePerTx: 1,
      index: 1,
      maxDifficulty: 62,
      previousHash: genesis.hash,
    } as BlockInfo);

    const tx = new Transaction({
      type: TransactionType.FEE,
      txOutputs: [
        new transactionOutput({
          toAddress: alice.publicKey,
          amount: 1,
        } as transactionOutput),
      ],
    } as Transaction);

    block.transactions.push(tx);

    block.hash = block.getHash();

    block.mine(exampleDifficulty, alice.publicKey);
    const valid = block.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
      exampleFee
    );
    expect(valid.sucess).toBeTruthy();
  });

  test("2 - should be valid", () => {
    const block = getFullBlock();
    const valid = block.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
      exampleFee
    );
    expect(valid.sucess).toBeTruthy();
  });

  test("3 - should NOT be valid (no fee)", () => {
    const block = getFullBlock();

    const valid = block.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
      exampleFee
    );
    expect(valid.sucess).toBeFalsy();
  });

  test("4 - should be NOT valid (2 FEE)", () => {
    const block = getFullBlock();
    block.transactions.push(
      new Transaction({
        type: TransactionType.FEE,
        txOutputs: [new transactionOutput()],
        txInputs: undefined,
      } as Transaction)
    );

    block.mine(exampleDifficulty, alice.publicKey);
    const valid = block.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
      exampleFee
    );
    expect(valid.sucess).toBeFalsy();
  });

  test("5 - should be NOT valid (Invalid tx)", () => {
    const block = getFullBlock();
    block.transactions[0].timestamp = -1;
    block.hash = block.getHash();
    block.mine(exampleDifficulty, alice.publicKey);
    const valid = block.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
      exampleFee
    );
    expect(valid.sucess).toBeFalsy();
  });

  test("6 - should be NOT valid (Invalid index)", () => {
    const block = getFullBlock();
    block.index = -1;

    const valid = block.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
      exampleFee
    );
    expect(valid.sucess).toBeFalsy();
  });

  test("7 - should be NOT valid (block not mined)", () => {
    const block = getFullBlock();
    block.nonce = 0;

    const valid = block.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
      exampleFee
    );
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

    block.hash = block.getHash();
    block.mine(exampleDifficulty, alice.publicKey);

    block.hash = "invalid_hash";

    const valid = block.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
      exampleFee
    );
    expect(valid.sucess).toBeFalsy();
  });

  test("9 - should be NOT valid (invalid previousHash)", () => {
    const block = getFullBlock();
    block.previousHash = "wrong";
    block.mine(exampleDifficulty, alice.publicKey);

    const valid = block.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
      exampleFee
    );
    expect(valid.sucess).toBeFalsy();
  });

  test("10 - should be NOT valid (invalid timestamp)", () => {
    const block = getFullBlock();
    block.timestamp = -1;
    block.mine(exampleDifficulty, alice.publicKey);

    const valid = block.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
      exampleFee
    );
    expect(valid.sucess).toBeFalsy();
  });

  test("11 - should NOT be valid (different hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [] as Transaction[],
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
    block.mine(exampleDifficulty, alice.publicKey);

    block.hash = "abc";

    const valid = block.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
      exampleFee
    );
    expect(valid.sucess).toBeFalsy();
  });

  test("12 - should be NOT valid (empty hash)", () => {
    const block = getFullBlock();
    block.hash = "";

    const valid = block.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
      exampleFee
    );
    expect(valid.sucess).toBeFalsy();
  });
});
