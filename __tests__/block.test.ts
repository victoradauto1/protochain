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
  // 1. Inicialização e Criação do Bloco
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

  // 2. Validação de Blocos
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

  // 3. Casos Específicos de Validação
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
      transactions: [new Transaction({} as Transaction)],
    } as Block);
    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new transactionOutput()]
    } as Transaction))

    block.hash = block.getHash();
    block.mine(exampleDifficulty, alice.publicKey);
    block.transactions[0].txOutputs[0].toAddress = "";
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  // Mais testes específicos, na ordem de lógica (hash inválido, índice, etc.)
  test("6 - should be NOT valid(index)", () => {
    const block = new Block({
      index: -1,
      transactions: [
        new Transaction({
          txInputs: [new TransactionInput()],
        } as Transaction),
      ],
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("7 - should be NOT valid (block not mined)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInputs: [new TransactionInput()],
        } as Transaction),
      ],
    } as Block);
    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new transactionOutput()]
    } as Transaction))

    block.hash = block.getHash();

    block.previousHash = genesis.hash; // Previous hash correto
    block.nonce = 0; // Nonce inválido
    block.miner = ""; // Miner inválido

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

  // Continuar com os outros testes na sequência lógica...
});
