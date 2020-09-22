const HDWalletProvider = require('@truffle/hdwallet-provider');
const NonceTrackerSubprovider = require('web3-provider-engine/subproviders/nonce-tracker');

// Using dotenv
require('dotenv').config();

/**
 * @title module.exports
 * @dev Truffle configuration sections
 *
 * Network:
 * - development: Deployment path on port 8545 (geth/ganache/rpc)
 * - ganachecli: Deployment path on port 7545 (ganache-cli)
 * - ropten: Deployment on the Ethereum ropsten test network (powered-by infura)
 * - mainnet: Deployment on the Ethereum main network (powered-by infura)
 *
 * rpc:
 * - host: server to connect to for rpc connection
 * - port: server port used to accept rpc connections
 *
 * Solc
 * - optimizer: should the optimizer be used (true/false)
 * - runs: number of times the optimizer shold be run
 */
module.exports = {
  networks: {
    development: {
      host: "localhost",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
      // websockets: true
      // gas: 100000000,          // Updated gas amount (Closed to mainnet block gas)
    },
    ganache: {
      host: "localhost",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
      // websockets: true
    },
    ganachecli: {
      host: "localhost",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
      // websockets: true
      // gas: 100000000,          // Updated gas amount (Closed to mainnet block gas)
    },
    ropsten: {
      provider: () => new HDWalletProvider(process.env.INFURA_MNEMONIC, `https://ropsten.infura.io/v3/${process.env.INFURA_PROJECTID}`), // infura Ropsten provider
      network_id: "3",            // Network id is 3 for ropsten
      // websockets: true
    },
    ropsten2: {
      provider: () => {
        var wallet = new HDWalletProvider(process.env.INFURA_MNEMONIC, `https://ropsten.infura.io/v3/${process.env.INFURA_PROJECTID}`); // infura Ropsten provider
        var nonceTracker = new NonceTrackerSubprovider();
        wallet.engine._providers.unshift(nonceTracker);
        nonceTracker.setEngine(wallet.engine);
        return wallet;
      },
      network_id: "3",            // Network id is 3 for ropsten
      // websockets: true
    },
    // mainnet: {
    //   provider: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECTID}`, // infura Mainnet provider
    //   network_id: "1",            // Network id is 3 for ropsten
    // },
  },
  rpc: {
    host: "127.0.0.1",
    port: 8080
  },
  // Set default mocha options here, use special reporters etc.
  mocha: {
    usecolors: true,
    timeout: 0
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.6.12", // Fetch exact version from solc-bin (default: truffle's version)
      docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: true,
         runs: 200
       },
       evmVersion: "petersburg"
      }
    }
  }
};
