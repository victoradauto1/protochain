import Block from "../src/lib/block";

let genesis: Block;

beforeAll(() => {
  genesis = new Block({ data: "Genesis" } as Block);
});

describe("Block tests", () => {

  test("should be valid", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "abc",
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.sucess).toBeTruthy();
  });
  
  test("should be NOT valid (fall backs)", () => {
    const block = new Block();
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.sucess).toBeFalsy();
  });
  
  test("should be NOT valid(index)", () => {
    const block = new Block({ index: -1, data: "abc" } as Block);
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.sucess).toBeFalsy();
  });

  test("should be NOT valid( previous hash)", () => {
    const block = new Block({ index: 1, data: "abc" } as Block);
    block.hash = "";
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.sucess).toBeFalsy();
  });

  test("should be NOT valid( previous hash)", () => {
    const block = new Block({ index: 1, data: "abc" } as Block);
    block.previousHash = "";
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.sucess).toBeFalsy();
  });

  test("should be NOT valid( invalid previous hash)", () => {
    const block = new Block({ index: 1, data: "abc" } as Block);
    const valid = block.isValid("invalid hash", genesis.index);
    expect(valid.sucess).toBeFalsy();
  });

  test("should be NOT valid(timestamp)", () => {
    const block = new Block({ index: 1, data: "abc" } as Block);
    block.timestamp = 0;
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.sucess).toBeFalsy();
  });

  test("should be NOT valid(data)", () => {
    const block = new Block({ index: 1, data: "abc" } as Block);
    block.data = "";
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.sucess).toBeFalsy();
  });
});
