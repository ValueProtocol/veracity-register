require('dotenv').config();

var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = process.env.MNEMONIC;
var infuraKey = process.env.INFURA_ACCESS_TOKEN;
var gasPrice = 10000000000;
var ropstenUrl = "https://ropsten.infura.io/v3/" + infuraKey;
var mainnetUrl = "https://mainnet.infura.io/" + infuraKey;

module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ganache_cli: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, ropstenUrl),
      network_id: 3,
      gasPrice: gasPrice
    },
    mainnet: {
      provider: new HDWalletProvider(mnemonic, mainnetUrl),
      network_id: 1,
      gasPrice: gasPrice
    }
  }
};
