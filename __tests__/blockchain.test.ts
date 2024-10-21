import Block from "../src/lib/block";
import Blockchain from "../src/lib/blockhain";

describe("Block tests", () => {
  test("should has genesis block", () => {
    const blockchain = new Blockchain();
    expect(blockchain.blocks.length).toEqual(1);
  });

  test("should be valid (the entire blockchain)", () => {
    const blockchain = new Blockchain();
    expect(blockchain.isValid()).toBeTruthy();
  });

  test("should be valid (Two blocks)", () => {
    const blockchain = new Blockchain();
    blockchain.addBlock(new Block(1, blockchain.blocks[0].hash, "Block 2"));
    expect(blockchain.isValid().sucess).toBeTruthy();
  });

  test("should be NOT valid (Two blocks)", () => {
    const blockchain = new Blockchain();
    blockchain.addBlock(new Block(1, blockchain.blocks[0].hash, "Block 2"));
    blockchain.blocks[1].data = "tampered data";
    expect(blockchain.isValid().sucess).toBeFalsy();
  });

  test("should add block", () => {
    const blockchain = new Blockchain();
    const result = blockchain.addBlock(
      new Block(1, blockchain.blocks[0].hash, "Block 2")
    );
    expect(result.sucess).toBeTruthy();
  });

  test("should NOT add block", () => {
    const blockchain = new Blockchain();
    const block = new Block(-1, blockchain.blocks[0].hash, "Block 2");
    const result = blockchain.addBlock(block);
    expect(result.sucess).toBeFalsy();
  });
});
