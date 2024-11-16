import Block from "../src/lib/block";
import BlockInfo from "../src/lib/blockInfo";
import Transaction from "../src/lib/transaction";
import TransactionInput from "../src/lib/transactionInput";
import TransactionType from "../src/lib/transactionType";

const exampleDifficulty = 1;
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
  // 1. Inicialização e Criação do Bloco
  test("1 - should create from blockInfo", () => {
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

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      to: exampleMiner
    } as Transaction))

    block.hash = block.getHash();

    block.mine(exampleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeTruthy();
  });

  // 2. Validação de Blocos
  test("2 - should be valid", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
        } as Transaction),
      ],
    } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      to: exampleMiner
    } as Transaction))

    block.hash = block.getHash();

    block.mine(exampleDifficulty, exampleMiner);
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
          txInput: new TransactionInput(),
        } as Transaction),
      ],
    } as Block);

    block.mine(exampleDifficulty, exampleMiner);
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

  test("5 - should be NOT valid (Invalid tx)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction({} as Transaction)],
    } as Block);
    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      to: exampleMiner
    } as Transaction))

    block.hash = block.getHash();
    block.mine(exampleDifficulty, exampleMiner);
    block.transactions[0].to = "";
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  // Mais testes específicos, na ordem de lógica (hash inválido, índice, etc.)
  test("6 - should be NOT valid(index)", () => {
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

  test("7 - should be NOT valid (block not mined)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
        } as Transaction),
      ],
    } as Block);
    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      to: exampleMiner
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
          txInput: new TransactionInput(),
        } as Transaction),
      ],
    } as Block);
   
    block.mine(exampleDifficulty, exampleMiner);

    block.hash = "invalid_hash";

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
    expect(valid.message).toBe("Invalid hash");
  });

  // Continuar com os outros testes na sequência lógica...
});
