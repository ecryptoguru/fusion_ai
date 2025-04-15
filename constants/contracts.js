// constants/contracts.js
// Replace the addresses with your actual deployed contract addresses for each chain

// FusionToken (FAI) deployed on Base Sepolia (chainId 84532)
export const FUSION_TOKEN_ADDRESS = "0xYourBaseFAITokenAddress";
export const FUSION_TOKEN_ABI = [
  // Only relevant ABI entries for staking and balance
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getStakedBalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  // ...add other ERC20 ABI entries as needed
];

// Marketplace addresses for each chain
export const MARKETPLACE_ADDRESS = {
  11155111: "0xYourEthereumSepoliaMarketplaceAddress",
  43113:    "0xYourAvalancheFujiMarketplaceAddress",
  421614:   "0xYourArbitrumSepoliaMarketplaceAddress",
  97:       "0xYourBSCTestnetMarketplaceAddress",
  80001:    "0xYourPolygonMumbaiMarketplaceAddress",
  84532:    "0xYourBaseSepoliaMarketplaceAddress"
};

export const MARKETPLACE_ABI = [
  // Only relevant ABI entries for frontend interactions
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "uint256", "name": "price", "type": "uint256" },
      { "internalType": "string", "name": "ipfsHash", "type": "string" },
      { "internalType": "uint256", "name": "totalCopies", "type": "uint256" },
      { "internalType": "uint256", "name": "subPrice", "type": "uint256" },
      { "internalType": "uint256", "name": "subDuration", "type": "uint256" }
    ],
    "name": "listModel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "modelId", "type": "uint256" },
      { "internalType": "bool", "name": "discountEligible", "type": "bool" }
    ],
    "name": "buyModel",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "modelId", "type": "uint256" },
      { "internalType": "bool", "name": "discountEligible", "type": "bool" }
    ],
    "name": "subscribeModel",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "modelId", "type": "uint256" },
      { "internalType": "uint8", "name": "rating", "type": "uint8" }
    ],
    "name": "rateModel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "modelId", "type": "uint256" }],
    "name": "reportModel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Add any additional ABI entries needed for reading model data, etc.
];
