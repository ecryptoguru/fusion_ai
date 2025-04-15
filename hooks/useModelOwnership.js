import { useState, useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from "../constants/contracts";

/**
 * Checks if the connected user owns or is subscribed to a model on a specific chain.
 * @param {object} model - The model object (must have id and chainId).
 * @returns {object} { isOwner, isSubscriber, loading }
 */
export function useModelOwnership(model) {
  const { address } = useAccount();
  const [ownership, setOwnership] = useState({ isOwner: false, isSubscriber: false, loading: true });

  // Assume contract has: function hasPurchased(address user, uint256 modelId) view returns (bool)
  // and: function isSubscribed(address user, uint256 modelId) view returns (bool)
  const { data: purchased, isLoading: loading1 } = useContractRead({
    address: MARKETPLACE_ADDRESS[model.chainId],
    abi: MARKETPLACE_ABI,
    functionName: "hasPurchased",
    args: [address, model.id],
    chainId: model.chainId,
    enabled: !!address && model?.id !== undefined,
    watch: true,
  });
  const { data: subscribed, isLoading: loading2 } = useContractRead({
    address: MARKETPLACE_ADDRESS[model.chainId],
    abi: MARKETPLACE_ABI,
    functionName: "isSubscribed",
    args: [address, model.id],
    chainId: model.chainId,
    enabled: !!address && model?.id !== undefined,
    watch: true,
  });

  useEffect(() => {
    setOwnership({
      isOwner: !!purchased,
      isSubscriber: !!subscribed,
      loading: loading1 || loading2,
    });
  }, [purchased, subscribed, loading1, loading2]);

  return ownership;
}
