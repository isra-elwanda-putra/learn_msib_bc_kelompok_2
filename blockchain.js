const SHA256 = require("crypto-js/sha256");

class CryptoBlock {
    constructor(index, timestamp, data, precedingHash = "") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.precedingHash = precedingHash;
        this.has = this.computeHash();
        this.nonce = 0;
    }

    computeHash() {
        return SHA256(
            this.index +
            this.precedingHash +
            this.timestamp +
            JSON.stringify(this.data) +
            this.nonce
        ).toString();
    }

    proofOfWork(difficulty) {
        while (this.hash && this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.has = this.computeHash();
        }
    }

}

class CryptoBlockchain {
    constructor() {
        this.blockchain = [this.startGenesisBlock()];
        this.difficulty = 4;
    }

    startGenesisBlock() {
        return new CryptoBlock(0, "16/11/2023", "Initial Block in the chain", "0");
    }

    obtainLatestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }

    addNewBlock(newBlock) {
        newBlock.precedingHash = this.obtainLatestBlock().hash;
        //newBlock.hash = newBlock.computeHash();
        newBlock.proofOfWork(this.difficulty);
        this.blockchain.push(newBlock);
    }

    checkChainValidity() {
        for (let i = 1; i < this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i];
            const precedingBlock = this.blockchain[i - 1];

            if (currentBlock.hash !== currentBlock.computeHash()) {
                return false;
            }
            if (currentBlock.precedingHash !== precedingBlock.hash) return false;
        }
        return true;
    }
}

let theblockchain = new CryptoBlockchain();

console.log("theblockchain mining in progress.....");
theblockchain.addNewBlock(
    new CryptoBlock(1, "16/11/2023", {
        sender: "Isra",
        recipient: "Elwanda",
        quantity: 100
    })
);

theblockchain.addNewBlock(
    new CryptoBlock(2, "17/11/2023", {
        sender: "Luna",
        recipient: "Elwanda",
        quantity: 50
    })
);

console.log(JSON.stringify(theblockchain, null, 4));