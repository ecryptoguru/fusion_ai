import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from "../../../constants/contracts";
import ModelDetail from "../../../components/ModelDetail";

const CHAIN_NAMES = {
  11155111: "Ethereum Sepolia",
  43113: "Avalanche Fuji",
  421614: "Arbitrum Sepolia",
  97: "BSC Testnet",
  80001: "Polygon Mumbai",
  84532: "Base Sepolia"
};

export default function ModelDetailMultiChainPage() {
  const router = useRouter();
  const { chainId, id } = router.query;
  const [model, setModel] = useState(null);

  // Fetch model details from the correct chain
  const { data } = useContractRead({
    address: MARKETPLACE_ADDRESS[Number(chainId)],
    abi: MARKETPLACE_ABI,
    functionName: "models",
    args: [Number(id)],
    chainId: Number(chainId),
    enabled: !!chainId && !!id,
    watch: true,
  });

  useEffect(() => {
    if (data) {
      setModel({ id: Number(id), chainId: Number(chainId), ...data });
    }
  }, [data, id, chainId]);

  if (!model) return <div className="p-4">Loading model details...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <ModelDetail model={model} chainName={CHAIN_NAMES[model.chainId]} />
    </div>
  );
}
