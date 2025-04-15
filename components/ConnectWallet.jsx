import { W3mButton } from "@reown/appkit";
import { useAccount, useBalance, useNetwork, useSwitchNetwork, useContractRead } from "wagmi";
import { AlertTriangle } from "lucide-react";
// You should replace these imports with your actual contract ABIs and addresses
import { FUSION_TOKEN_ABI, FUSION_TOKEN_ADDRESS } from "../constants/contracts";

export default function ConnectWallet({ requiredChainId }) {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { data: balance } = useBalance({ address });
  // Query FAI staking status from Base
  const { data: staked } = useContractRead({
    address: FUSION_TOKEN_ADDRESS,
    abi: FUSION_TOKEN_ABI,
    functionName: "getStakedBalance",
    args: [address],
    chainId: 84532, // Base Sepolia
    enabled: !!address,
    watch: true,
  });

  const isChainMismatch = requiredChainId && chain?.id !== requiredChainId;
  const isStaked = staked && staked >= BigInt("10000000000000000000"); // 10 FAI

  return (
    <div className="flex flex-col gap-2">
      <W3mButton />
      {address && (
        <div className="text-xs text-gray-500">
          Connected: {address.slice(0, 6)}...{address.slice(-4)} | {chain?.name} | {balance?.formatted} {balance?.symbol}
        </div>
      )}
      {isChainMismatch && (
        <div className="flex items-center text-yellow-600">
          <AlertTriangle className="w-4 h-4 mr-1" /> Wrong chain!{" "}
          <button className="ml-2 underline" onClick={() => switchNetwork?.(requiredChainId)}>
            Switch
          </button>
        </div>
      )}
      {chain?.id === 84532 && (
        <div>
          {isStaked ? (
            <span className="text-green-600">10 FAI staked – Discount active!</span>
          ) : (
            <span className="text-blue-600">Stake 10 FAI on Base for 10% discount</span>
          )}
        </div>
      )}
    </div>
  );
}
