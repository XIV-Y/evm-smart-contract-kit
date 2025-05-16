require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // ローカルノード
    localhost: {
      url: "http://hardhat:8545",
      chainId: 31337,
    },
    // Dockerの外からアクセスする場合
    dockerhost: {
      url: "http://localhost:8545",
      chainId: 31337,
    },
    // テストネット
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY]
    },
    // メインネット
    // mainnet: {
    //   url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    //   accounts: [PRIVATE_KEY]
    // }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
