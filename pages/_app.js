import '@/styles/globals.css';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  sepolia,
  mainnet,
  avalancheFuji,
  arbitrumSepolia,
  bscTestnet,
  polygonMumbai,
  baseSepolia,
} from 'wagmi/chains';

const config = createConfig({
  chains: [
    sepolia,
    avalancheFuji,
    arbitrumSepolia,
    bscTestnet,
    polygonMumbai,
    baseSepolia,
    mainnet,
  ],
  transports: {
    [sepolia.id]: http(),
    [avalancheFuji.id]: http(),
    [arbitrumSepolia.id]: http(),
    [bscTestnet.id]: http(),
    [polygonMumbai.id]: http(),
    [baseSepolia.id]: http(),
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
