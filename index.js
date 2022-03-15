const fs = require('fs')
const path = require('path')
const ganache = require('ganache')

const totalAccounts = parseInt(process.env.TOTAL_ACCOUNTS, 10)
const unlockedAccounts = Array(totalAccounts).fill(0).reduce((acc, _, i) => `${acc} ${i}`, '')

const options = {
    server: {
        host: process.env.HOST,
    },
    chain: {
        chainId: parseInt(process.env.CHAIN_ID, 10),
        networkId: parseInt(process.env.NETWORK_ID, 10),
        vmErrorsOnRPCResponse: false,
    },
    wallet: {
        mnemonic: process.env.MNEMONIC,
        totalAccounts,
        unlockedAccounts,
        accountKeysPath: process.env.ACCOUNT_KEYS_PATH,
        defaultBalance: parseInt(process.env.DEFAULT_BALANCE),
    },
    database: {
        dbPath: process.env.DB_PATH,
    },
}

const server = ganache.server(options)
const port = process.env.NODE_ENV === 'production' ? 80 : 8545

server.listen(port, err => {
    
    if (err) throw err
    
    console.log(`Ganache listening on port ${port}...`)
    
    if (process.env.LOG_ACCOUNTS) {
        const wallets = path.resolve(__dirname, 'accounts.json')
        const accounts = JSON.parse(fs.readFileSync(wallets, 'utf8'))
        console.log('ACCOUNTS', JSON.stringify(accounts, null, 4))
    }
    
})
