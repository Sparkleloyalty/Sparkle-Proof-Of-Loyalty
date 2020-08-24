require("dotenv").config();

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
      host: "localhost", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    ganache: {
      host: "localhost", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    ganachecli: {
      host: "localhost", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    ropsten: {
      provider: `https://ropsten.infura.io/v3/${process.env.INFURA_PROJECTID}`, // infura Ropsten provider
      network_id: "3", // Network id is 3 for ropsten
    },
    mainnet: {
      provider: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECTID}`, // infura Mainnet provider
      network_id: "1", // Network id is 3 for ropsten
    },
  },
  rpc: {
    host: "127.0.0.1",
    port: 8080,
  },
  // Set default mocha options here, use special reporters etc.
  mocha: {
    timeout: 0,
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.4.25", // Fetch exact version from solc-bin (default: truffle's version)
      docker: true, // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
          runs: 200,
        },
        evmVersion: "byzantium",
      },
    },
  },
};
