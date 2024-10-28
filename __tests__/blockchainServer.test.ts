import { jest } from "@jest/globals";
import request from "supertest";
import { app } from "../src/server/blockchainServer";

jest.mock("../src/lib/__mocks__/block.ts");
jest.mock("../src/lib/__mocks__/blockchain.ts");

describe("BlockchainServer tests", () => {
  test("GET / status", async () => {
    const response = await request(app).get("/status/");
    expect(response.status).toEqual(200);
    expect(response.body.isValid.sucess).toEqual(true);
  });
});
