const { ethers } = require("ethers");
const ganache = require("ganache-core");
const express = require("express");
const app = express();
app.use(express.json());

// Initialize Ganache server
const options = {
    wallet: {
        mnemonic: process.env.MNEMONIC,
        totalAccounts: parseInt(process.env.TOTAL_ACCOUNTS, 10),
        unlockedAccounts: Array(parseInt(process.env.TOTAL_ACCOUNTS, 10)).fill(0).reduce((acc, _, i) => `${acc} ${i}`, ''),
        defaultBalance: parseInt(process.env.DEFAULT_BALANCE, 10),
    },
    chain: {
        chainId: parseInt(process.env.CHAIN_ID, 10),
        networkId: parseInt(process.env.NETWORK_ID, 10),
        vmErrorsOnRPCResponse: false,
    },
    database: {
        dbPath: process.env.DB_PATH,
    },
};

const server = ganache.server(options);
const provider = new ethers.JsonRpcProvider("http://localhost:8545");

server.listen(8545, () => console.log("Ganache server running on port 8545"));

app.post('/api', async (req, res) => {
    try {
        const { method, params } = req.body;

        if (method === "eth_getBlockByNumber") {
            const result = await provider.send(method, params);
            res.json(result);
        } else {
            res.status(400).json({ error: "Unsupported method" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;
