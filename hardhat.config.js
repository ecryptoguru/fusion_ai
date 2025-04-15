require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    ethereumSepolia: { url: process.env.ETHEREUM_SEPOLIA_RPC, accounts: [process.env.PRIVATE_KEY], chainId: 11155111 },
    avalancheFuji: { url: process.env.AVALANCHE_FUJI_RPC, accounts: [process.env.PRIVATE_KEY], chainId: 43113 },
    arbitrumSepolia: { url: process.env.ARBITRUM_SEPOLIA_RPC, accounts: [process.env.PRIVATE_KEY], chainId: 421614 },
    bscTestnet: { url: process.env.BSC_TESTNET_RPC, accounts: [process.env.PRIVATE_KEY], chainId: 97 },
    polygonMumbai: { url: process.env.POLYGON_MUMBAI_RPC, accounts: [process.env.PRIVATE_KEY], chainId: 80001 },
    baseSepolia: { url: process.env.BASE_SEPOLIA_RPC, accounts: [process.env.PRIVATE_KEY], chainId: 84532 },
  },
};
