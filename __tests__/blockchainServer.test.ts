import { jest } from "@jest/globals";
import request from "supertest";
import Block from "../src/lib/block";
import { app } from "../src/server/blockchainServer";
import Transaction from "../src/lib/transaction";
import TransactionInput from "../src/lib/transactionInput";

jest.mock("../src/lib/block.ts");
jest.mock("../src/lib/blockchain.ts");
jest.mock("../src/lib/transactionInput");

describe("BlockchainServer tests", () => {
  test("GET / status  - Should return status", async () => {
    const response = await request(app).get("/status/");
    expect(response.status).toEqual(200);
    expect(response.body.isValid.sucess).toEqual(true);
  });

  test("GET / blocks / next  - Should get next block info", async () => {
    const response = await request(app).get("/blocks/next");
    expect(response.status).toEqual(200);
    expect(response.body.index).toEqual(1);
  });

  test("GET / blocks/:index - should get genesis", async () => {
    const response = await request(app).get("/blocks/0");
    expect(response.status).toEqual(200);
    expect(response.body.index).toEqual(0);
  });

  test("GET / blocks/:hash - should get block", async () => {
    const response = await request(app).get("/blocks/abc");
    expect(response.status).toEqual(200);
    expect(response.body.hash).toEqual("abc");
  });

  test("GET / blocks/:id - should NOT get block", async () => {
    const response = await request(app).get("/blocks/-1");
    expect(response.status).toEqual(404);
  });

  test("POST / blocks/ - should add block", async () => {
    const block = new Block({
      index: 1,
    } as Block);
    const response = await request(app).post("/blocks/").send(block);
    expect(response.status).toEqual(201);
    expect(response.body.index).toEqual(1);
  });

  test("POST / blocks/ - should NOT add block (empty)", async () => {
    const response = await request(app).post("/blocks/").send({});
    expect(response.status).toEqual(422);
  });

  test("POST / blocks/ - should NOT add block (invalid)", async () => {
    const block = new Block({
      index: -1,
    } as Block);
    const response = await request(app).post("/blocks/").send(block);
    expect(response.status).toEqual(400);
  });

  test("GET / transactions/:hash? - should get transactions", async () => {
    const response = await request(app).get("/transactions/abc");
    expect(response.status).toEqual(200);
    expect(response.body.mempoolIndex).toEqual(0);
  });

  test("POST / transactions/ - should add tx", async () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: "CarteiraTo"
    } as Transaction)
    const response = await request(app).post("/transactions/").send(tx);
    expect(response.status).toEqual(201);
  });
});
