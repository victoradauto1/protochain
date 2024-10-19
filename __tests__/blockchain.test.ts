import Blockchain from "../src/lib/blockhain";

describe("Block tests", ()=>{
    test("should has genesis block", ()=>{
        const blockchain = new Blockchain();
        expect(blockchain.blocks.length).toEqual(1);
    });

    test("should de valid (the entire blockchain)", ()=>{
        const blockchain = new Blockchain();
        expect(blockchain.isValid()).toBeTruthy();
    });
})
