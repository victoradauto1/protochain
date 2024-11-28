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

  // 1. Verifica se existe o bloco gênese
  test("1. should has genesis block", () => {
    const blockchain = new Blockchain(alice.publicKey);
    expect(blockchain.blocks.length).toEqual(1);
  });

  // 2. Verifica a validade de toda a blockchain
  test("2. should be valid (the entire blockchain)", () => {
    const blockchain = new Blockchain(alice.publicKey);
    expect(blockchain.isValid()).toBeTruthy();
  });

  // 3. Verifica a validade de uma blockchain com dois blocos
  test("3. should be valid (Two blocks)", () => {
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

  // 4. Verifica a invalidade de uma blockchain com dois blocos
  test("4. should NOT be valid (Two blocks)", () => {
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

  // 5. Verifica se adiciona uma transação
  test("5. should add transaction", () => {
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

  // 6. Verifica se NÃO adiciona uma transação (transação inválida)
  test("6. should NOT add transaction (invalid tx)", () => {
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

  // 7. Verifica se NÃO adiciona uma transação (pendente na mempool)
  test("7. should NOT add transaction (pending transaction)", () => {
    const blockchain = new Blockchain(alice.publicKey);
    const txo = blockchain.blocks[0].transactions[0];

    const tx = new Transaction();
    tx.hash = "tx";
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

    blockchain.mempool.push(tx);

    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toBeFalsy();
    expect(validation.message).toBe("This wallet has a pending transaction.")
  });

  // 8. Verifica se NÃO adiciona uma transação (UTXO já gasto ou inexistente)
  test("8. should NOT add transaction (spent UTXO or non-existent)", () => {
    const blockchain = new Blockchain(alice.publicKey);
 
    const tx = new Transaction();
    tx.hash = "tx";

    tx.txInputs = [new TransactionInput(
      {
        previousTx: "nonexistent-tx-id", 
        amount: 10,
      }as TransactionInput
    )];

    tx.txOutputs = [new transactionOutput({
      amount: 10,
      toAddress: 'abc'
    } as transactionOutput)];


    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toBeFalsy();
    expect(validation.message).toBe("Invalid Tx: the TXO is already spent or unexistent.")
  });

  test("9. should NOT add transaction (duplicated tx)", () => {
    const blockchain = new Blockchain(alice.publicKey);
   
    const tx = new Transaction();
    tx.txInputs = [
      new TransactionInput({
        amount: 10,
        previousTx: "abc",
        fromAddress: alice.publicKey,
        signature: "abc",
      } as TransactionInput),
    ];

    tx.txOutputs = [
      new transactionOutput({
        amount: 10,
        toAddress: "zyz",
      } as transactionOutput),
    ];

    tx.hash = tx.getHash();

    blockchain.addTransaction(tx);
    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toBeFalsy();
    expect(validation.message).toBe("Duplicate tx in blockchain")
  });

  test("9. should NOT add transaction (duplicated tx)", () => {
    const blockchain = new Blockchain(alice.publicKey);
   
    const tx = new Transaction();
    tx.txInputs = [
      new TransactionInput({
        amount: 10,
        previousTx: "abc",
        fromAddress: alice.publicKey,
        signature: "abc",
      } as TransactionInput),
    ];

    tx.txOutputs = [
      new transactionOutput({
        amount: 10,
        toAddress: "zyz",
      } as transactionOutput),
    ];

    tx.hash = tx.getHash();

    blockchain.addTransaction(tx);
    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toBeFalsy();
    expect(validation.message).toBe("Duplicate tx in blockchain")
  });

  // Teste do método getBlock
  test("10. Sould get block by hash", () => {
    const blockchain = new Blockchain(alice.publicKey);
    const genesisBlock = blockchain.blocks[0];
    
    const foundBlock = blockchain.getBlock(genesisBlock.hash);
    expect(foundBlock).toEqual(genesisBlock);
    
    const unexistent = blockchain.getBlock("unexistent");
    expect(unexistent).toBeUndefined();
  });

  // Teste do método getTransaction na mempool
  test("11.Should get a tx in mempool", () => {
    const blockchain = new Blockchain(alice.publicKey);
    const tx = new Transaction();
    tx.hash = "tx-mempool";
    
    blockchain.mempool.push(tx);
    const result = blockchain.getTransaction(tx.hash);
    
    expect(result.mempoolIndex).toBeGreaterThanOrEqual(0);
    expect(result.transaction).toEqual(tx);
  });

  // Teste do método getTransaction em bloco
  test("12.Should get a transaction in block", () => {
    const blockchain = new Blockchain(alice.publicKey);
    const txGenesis = blockchain.blocks[0].transactions[0];
    
    const result = blockchain.getTransaction(txGenesis.hash);
    
    expect(result.blockIndex).toBe(0);
    expect(result.transaction).toEqual(txGenesis);
  });

  // // Teste de transação não encontrada
  // test("deve retornar índices -1 para transação não encontrada", () => {
  //   const blockchain = new Blockchain(alice.publicKey);
  //   const resultado = blockchain.getTransaction("hash-inexistente");
    
  //   expect(resultado.blockIndex).toBe(-1);
  //   expect(resultado.mempoolIndex).toBe(-1);
  //   expect(resultado.transaction).toBeNull();
  // });

  // // Teste do método getNextBlock
  // test("deve retornar null quando mempool vazia", () => {
  //   const blockchain = new Blockchain(alice.publicKey);
  //   blockchain.mempool = [];
    
  //   const resultado = blockchain.getNextBlock();
  //   expect(resultado).toBeNull();
  // });

  // // Teste de obtenção do UTXO
  // test("deve retornar UTXO correto da carteira", () => {
  //   const blockchain = new Blockchain(alice.publicKey);
  //   const utxo = blockchain.getUtxo(alice.publicKey);
    
  //   expect(utxo).toHaveLength(1); // Genesis block reward
  //   expect(utxo[0].toAddress).toBe(alice.publicKey);
  // });

  // // Teste de cálculo de saldo
  // test("deve calcular saldo corretamente", () => {
  //   const blockchain = new Blockchain(alice.publicKey);
  //   const saldo = blockchain.getBalance(alice.publicKey);
  //   const recompensa = Blockchain.getRewardAmount(blockchain.getDifficulty());
    
  //   expect(saldo).toBe(recompensa);
  //   expect(blockchain.getBalance(bob.publicKey)).toBe(0);
  // });

  // // Teste de cálculo de recompensa
  // test("deve calcular recompensa corretamente", () => {
  //   const dificuldade = 5;
  //   const recompensa = Blockchain.getRewardAmount(dificuldade);
    
  //   expect(recompensa).toBe((64 - dificuldade) * 10);
  // });

});
