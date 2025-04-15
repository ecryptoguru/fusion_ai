// hooks/useModels.js
import { useMemo } from "react";
import { useContractRead } from "wagmi";
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from "../constants/contracts";

/**
 * Fetch all models from Marketplace.sol on a given chain using wagmi.
 * @param {number} chainId - The target chain ID.
 * @returns {object[]} Array of model objects.
 */
export function useModels(chainId) {
  // Fetch the nextModelId to know how many models exist
  const { data: nextModelId } = useContractRead({
    address: MARKETPLACE_ADDRESS[chainId],
    abi: MARKETPLACE_ABI,
    functionName: "nextModelId",
    chainId,
    watch: true,
  });

  // Fetch each model by index (inefficient for large numbers; use The Graph for scaling)
  const modelCount = Number(nextModelId) || 0;
  const models = [];
  for (let i = 0; i < modelCount; i++) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data } = useContractRead({
      address: MARKETPLACE_ADDRESS[chainId],
      abi: MARKETPLACE_ABI,
      functionName: "models",
      args: [i],
      chainId,
      watch: true,
      enabled: modelCount > 0,
    });
    if (data) models.push({ id: i, ...data });
  }
  // Memoize to avoid unnecessary re-renders
  return useMemo(() => models, [modelCount, ...models]);
}
