import Block from "../src/lib/block";

let genesis: Block;

beforeAll(()=>{
    genesis = new Block(0,"", "Genesis" );
});

describe("Block tests", ()=>{
    test("should be valid", ()=>{
        const block = new Block(1, genesis.hash, "abc");
        const valid = block.isValid(genesis.hash, genesis.index);
        expect(valid).toBeTruthy();
    });

    test("should be NOT valid(index)", ()=>{
        const block = new Block(-1, genesis.hash, "abc");
        const valid = block.isValid(genesis.hash, genesis.index);
        expect(valid).toBeFalsy();
    });

    test("should be NOT valid( previous hash)", ()=>{
        const block = new Block(1,genesis.hash, "abc");
        block.hash = "";
        const valid = block.isValid(genesis.hash, genesis.index);
        expect(valid).toBeFalsy();
    });

    test("should be NOT valid( previous hash)", ()=>{
        const block = new Block(1,genesis.hash, "abc");
        block.previousHash = "";
        const valid = block.isValid(genesis.hash, genesis.index);
        expect(valid).toBeFalsy();
    });


    test("should be NOT valid(timestamp)", ()=>{
        const block = new Block(1, genesis.hash, "abc");
        block.timestamp = 0;
        const valid = block.isValid(genesis.hash, genesis.index);
        expect(valid).toBeFalsy();
    });

    test("should be NOT valid(data)", ()=>{
        const block = new Block(1, genesis.hash, "abc");
        block.data = "";
        const valid = block.isValid(genesis.hash, genesis.index);
        expect(valid).toBeFalsy();
    });
})