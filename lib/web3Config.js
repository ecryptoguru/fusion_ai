import { createWagmiConfig } from "@reown/appkit-wagmi";
import { sepolia, avalancheFuji, arbitrumSepolia, bscTestnet, polygonMumbai, baseSepolia } from "wagmi/chains";

const chains = [sepolia, avalancheFuji, arbitrumSepolia, bscTestnet, polygonMumbai, baseSepolia];

export const wagmiConfig = createWagmiConfig({
  chains,
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
});
