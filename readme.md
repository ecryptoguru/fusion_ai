Decentralized AI Marketplace
A multi-chain platform where developers can upload, share, and monetize AI models or agents, with options for multiple copies and subscriptions, using the native token of the chain (e.g., ETH, AVAX, BNB, MATIC) for payments across Ethereum, Avalanche, Arbitrum, BSC, Polygon, and Base. The Fusion (FAI) token, deployed on Base, offers a 10% discount to buyers staking 10 FAI. Built with Next.js 14, it leverages IPFS, Reown, and a modern UI with Tailwind CSS, shadcn/ui, and Lucide Icons, enhanced with subscriptions and security features.

Features
Target Users: AI developers (sellers) and Web3 users/businesses (buyers).
Multi-Chain Support: List models on Ethereum (ETH), Avalanche (AVAX), Arbitrum (ETH), BSC (BNB), Polygon (MATIC), Base (ETH); pay with native tokens.
AI Model Marketplace: Sell multiple copies (e.g., 5/5 sold) or subscriptions (e.g., 0.01 ETH/month), with 10% discount for staking 10 FAI on Base.
Token Economy: Native tokens for payments, FAI on Base for staking discounts, 3% fees.
Security: Reporting, reentrancy protection.
UI/UX: Search, filters, previews, multi-language.

Tech Stack:
Blockchain:
Ethereum (ETH) (https://ethereum.org/en/developers/docs/)
Avalanche (AVAX) (https://build.avax.network/docs)
Arbitrum (ETH) (https://docs.arbitrum.io/welcome/get-started)
Binance Smart Chain (BNB) (https://docs.bnbchain.org/)
Polygon (MATIC) (https://docs.polygon.technology/)
Base (ETH, FAI Token) (https://docs.base.org/)
Smart Contracts: Solidity (https://docs.soliditylang.org/en/v0.8.29/), Hardhat (https://hardhat.org/docs)
Storage: IPFS (https://docs.ipfs.tech/) via ipfs-http-client (https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client)

Frontend:
Next.js 14 (https://nextjs.org/docs/14/getting-started)
Tailwind CSS (https://tailwindcss.com/docs/installation/using-vite)
shadcn/ui (https://ui.shadcn.com/docs)
Lucide Icons via lucide-react (https://lucide.dev/guide/)

Wallet:
Reown via @reown/appkit (https://docs.reown.com/overview)
wagmi (https://wagmi.sh/)
viem (https://viem.sh/)

Enhancements: The Graph for indexing (https://thegraph.com/docs/en/), next-intl for multi-language (https://next-intl.dev/)

Core Features

Smart Contracts (Solidity):

FusionToken.sol:
ERC-20 token with mint, transfer, approve, transferFrom, balanceOf, stake, unstake.
Deployed on Base (testnet: Base Sepolia, chain ID 84532).
Staking: Buyers stake 10 FAI on Base for a 10% discount on native token payments.

Marketplace.sol:
Struct: Model { uint256 id, string name, string description, uint256 price, address developer, string ipfsHash, uint256 ratingSum, uint256 ratingCount, uint256 totalCopies, uint256 copiesSold, uint256 subPrice, uint256 subDuration }.
Mapping: models(uint256 => Model); subscriptions(uint256 modelId => mapping(address => uint256 expiry)).
Constants: address FAI_TOKEN = 0xBaseFAIAddress; uint256 DISCOUNT_THRESHOLD = 10 ether; uint256 DISCOUNT_PERCENT = 10.
Functions:
listModel(string name, string description, uint256 price, string ipfsHash, uint256 totalCopies, uint256 subPrice, uint256 subDuration): List on the deployed chain, price/subPrice in native token (e.g., ETH, AVAX).
buyModel(uint256 modelId) payable: Pay in native token; apply 10% discount if 10 FAI staked on Base (check via Base RPC or off-chain).
subscribeModel(uint256 modelId) payable: Pay subPrice in native token, apply discount if staked.
rateModel(uint256 modelId, uint8 rating): Rate if purchased/subscribed.
reportModel(uint256 modelId): Flag for review.
Events: ModelListed, ModelPurchased, ModelSubscribed, ModelRated, ModelReported.
Security: Use ReentrancyGuard; add cooldown.
Multi-chain: Deploy on each chain; payments in native token (msg.value), FAI staking on Base.
IPFS Integration (JavaScript):
Module (lib/ipfsService.js):
uploadModel(file): Upload file to IPFS.
uploadMetadata(name, description, price, ipfsHash, totalCopies, subPrice, subDuration): Include subscription details.
downloadModel(ipfsHash): Retrieve file.

Frontend (Next.js 14):

Components:
ConnectWallet: Reown’s <w3m-button />, show native token balance, Base FAI staking status (Lucide AlertTriangle for chain warning).
ModelUploadForm: Add totalCopies, subPrice, subDuration (Lucide Copy, Clock), chain selector, prices in native token.
ModelList: Show copies, subscriptions, search (Lucide Search), filters, display price in chain’s native token with discount option.
ModelDetail: Show copy/subscription status, ‘Buy’/’Subscribe’ in native token (Lucide Coins), discount toggle if 10 FAI staked, report (Lucide Flag).
Pages: Emphasize native token payments with Base FAI staking.
Testing: Test native token payments, FAI discount, subscriptions, copy limits, reporting, multi-chain listings.
Technical Requirements
Blockchain: Deploy FusionToken.sol on Base Sepolia; deploy Marketplace.sol on all testnets; payments in native tokens.
Frontend: Use next-intl for multi-language, The Graph for indexing; verify FAI staking on Base via RPC.
UI/UX: Add previews (Lucide Eye), dashboard (Lucide BarChart).
Deliverables
Source Code: Reflect native token payments, Base FAI staking discount.
Tests: Test native token payments with/without discount.


Prerequisites
Node.js: v18+ (Download)
Git: (Download)
VSCode: (Download)
Wallet: Web3 wallet with native tokens on testnets (e.g., Ethereum Sepolia Faucet, Avalanche Faucet, Base Faucet) and FAI on Base Sepolia.
Reown Project ID: From Reown Cloud.
RPC URLs: Testnet RPCs (e.g., Infura, Alchemy).
Project Structure

decentralized-ai-marketplace/
├── contracts/              # Smart contracts
├── pages/                  # Next.js pages
├── components/             # React components
├── lib/                    # Utilities
├── public/                 # Static assets
├── styles/                 # Global CSS
├── test/                   # Test files
├── scripts/                # Deployment scripts
├── .gitignore
├── hardhat.config.js
├── tailwind.config.js
├── next.config.js
├── package.json
├── README.md
└── manual-tests.txt
Setup Instructions
1. Install Dependencies

npm install
Key packages: next@14, @reown/appkit, wagmi, viem, hardhat, ipfs-http-client, lucide-react, class-variance-authority, clsx, tailwind-merge, next-intl

2. Configure Environment
Create .env:

PRIVATE_KEY=your-wallet-private-key
NEXT_PUBLIC_REOWN_PROJECT_ID=your-reown-project-id
NEXT_PUBLIC_BASE_FAI_ADDRESS=deployed-fai-address-on-base
4. Configure Hardhat for Multi-Chain
Edit hardhat.config.js:


require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    ethereumSepolia: { url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY", accounts: [process.env.PRIVATE_KEY], chainId: 11155111 },
    avalancheFuji: { url: "https://api.avax-test.network/ext/bc/C/rpc", accounts: [process.env.PRIVATE_KEY], chainId: 43113 },
    arbitrumSepolia: { url: "https://sepolia-rollup.arbitrum.io/rpc", accounts: [process.env.PRIVATE_KEY], chainId: 421614 },
    bscTestnet: { url: "https://data-seed-prebsc-1-s1.binance.org:8545/", accounts: [process.env.PRIVATE_KEY], chainId: 97 },
    polygonMumbai: { url: "https://rpc-mumbai.maticvigil.com", accounts: [process.env.PRIVATE_KEY], chainId: 80001 },
    baseSepolia: { url: "https://sepolia.base.org", accounts: [process.env.PRIVATE_KEY], chainId: 84532 },
  },
};
5. Deploy Smart Contracts
Compile:

npx hardhat compile
Deploy FusionToken.sol on Base Sepolia:

npx hardhat run scripts/deploy.js --network baseSepolia
Deploy Marketplace.sol on all testnets (update with Base FAI address):

npx hardhat run scripts/deploy.js --network ethereumSepolia
npx hardhat run scripts/deploy.js --network avalancheFuji
npx hardhat run scripts/deploy.js --network arbitrumSepolia
npx hardhat run scripts/deploy.js --network bscTestnet
npx hardhat run scripts/deploy.js --network polygonMumbai
npx hardhat run scripts/deploy.js --network baseSepolia
Update .env with NEXT_PUBLIC_BASE_FAI_ADDRESS.
6. Configure Reown for Multi-Chain
Update lib/web3Config.js:

import { createWagmiConfig } from "@reown/appkit-wagmi";
import { sepolia, avalancheFuji, arbitrumSepolia, bscTestnet, polygonMumbai, baseSepolia } from "wagmi/chains";

const chains = [sepolia, avalancheFuji, arbitrumSepolia, bscTestnet, polygonMumbai, baseSepolia];

export const wagmiConfig = createWagmiConfig({
  chains,
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
});
7. Run the Development Server

npm run dev
Open http://localhost:3000.
Usage
Connect Wallet: Use Reown (Lucide Wallet), ensure native token balance (e.g., AVAX on Avalanche), stake 10 FAI on Base for discount (Lucide Globe to switch).
Upload a Model: Go to /upload, set copies and subscription (Lucide Copy, Clock), select chain, price in native token.
Browse Models: Filter by chain, copies, subscriptions (Lucide Search); prices in native token with discount option.
Buy or Subscribe: Purchase/subscribe at /model/[id] in native token (Lucide Coins), toggle discount if 10 FAI staked, view timer (Lucide Clock).
Report: Flag models (Lucide Flag).
Testing
Smart Contracts

npx hardhat test
Tests native token payments (e.g., ETH on Ethereum, BNB on BSC), 10% discount with 10 FAI staked, subscriptions, copy limits, reporting.
IPFS Integration

npm test
Verifies metadata with copies/subscriptions.
Frontend (Manual)
See manual-tests.txt:

Connect, stake 10 FAI on Base Sepolia.
Upload (‘Test Model’, 0.01 AVAX, 3 copies, 0.005 AVAX/month) on Avalanche Fuji.
Buy 2 copies (check discount), subscribe, report.
Troubleshooting
Discount Not Applied: Verify 10 FAI staked on Base via Base RPC.
Payment Fails: Ensure sufficient native token on the selected chain.
Enhancements
Analytics: Add /dashboard (Lucide BarChart).
Previews: Upload previews to IPFS (Lucide Eye).
Custom Tokens: Support additional tokens with price feeds.
