import Transaction from "../src/lib/transaction";
import TransactionInput from "../src/lib/transactionInput";
import transactionOutput from "../src/lib/transactionOutput";
import TransactionType from "../src/lib/transactionType";

jest.mock("../src/lib/transactionInput");
jest.mock("../src/lib/transactionOutput")

describe("Transaction test", () => {

  test("should be valid (FEE)", () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new transactionOutput],
      type: TransactionType.FEE,
    } as Transaction);

    tx.txInputs = undefined;
    tx.hash = tx.getHash();
    
    const valid = tx.isValid();
    expect(valid.sucess).toBeTruthy();
  });

  test("should be valid (REGULAR with params Invalid Hash)", () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new transactionOutput],
      type: TransactionType.REGULAR,
      timestamp: Date.now(),
      hash: "abc",
    } as Transaction);
    const valid = tx.isValid();
    expect(valid.sucess).toBeFalsy();
  });

  //PROTOTIPO DE TESTE PARA COBRIR A LINHA 21 DE TRANSACTION.TS
  // test("should create a TransactionInput with txInput provided in tx", () => {
  //   const mockTxInput = { /* propriedades necessárias de TransactionInput */ };
    
  //   const tx = new Transaction({ txInput: mockTxInput } as Transaction);
    
  //   const transactionInputInstance = new TransactionInput(tx);

  //   // Verificando que transactionInputInstance.txInput foi inicializado corretamente
  //   expect(transactionInputInstance.txInput).toBeInstanceOf(TransactionInput);
  //   expect(transactionInputInstance.txInput).toEqual(expect.objectContaining(mockTxInput));
  // });
  

  test("should NOT be valid (Invalid Hash)", () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new transactionOutput],
      hash: "abc",
    } as Transaction);
    const valid = tx.isValid();
    expect(valid.sucess).toBeFalsy();
  });

  test("should NOT be valid (Invalid to)", () => {
    const tx = new Transaction();
    const valid = tx.isValid();
    expect(valid.sucess).toBeFalsy();
  });

  test("should NOT be valid (Invalid txInput)", () => {
    const tx = new Transaction({
      txOutputs: [new transactionOutput],
      txInputs: [new TransactionInput({
        amount: -10,
        fromAddress: "From",
        signature: "abc"
      } as TransactionInput)] 
    }as Transaction);
    const valid = tx.isValid();
    expect(valid.sucess).toBeFalsy();
  });
});
