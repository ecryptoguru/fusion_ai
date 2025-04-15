// hooks/useAllModels.js
import { useMemo } from "react";
import { useModels } from "./useModels";
import { MARKETPLACE_ADDRESS, MARKETPLACE_ABI } from "../constants/contracts";

const SUPPORTED_CHAINS = Object.keys(MARKETPLACE_ADDRESS).map(Number);

/**
 * Fetch and merge models from all supported chains, with optional search/filter.
 * @param {object} options - Optional filter/search options.
 * @param {string} options.search - Search string to filter models by name or description.
 * @param {function} options.filterFn - Custom filter function (model => boolean).
 * @returns {object[]} Filtered array of all models across chains.
 */
export function useAllModels({ search = "", filterFn } = {}) {
  // Call useModels for each chain at the top level
  const modelsByChain = SUPPORTED_CHAINS.map(chainId => ({
    chainId,
    models: useModels(chainId),
    marketplaceAddress: MARKETPLACE_ADDRESS[chainId],
    marketplaceAbi: MARKETPLACE_ABI,
  }));

  // Merge, annotate, and filter models
  return useMemo(() => {
    let allModels = modelsByChain.flatMap(({ chainId, models, marketplaceAddress, marketplaceAbi }) =>
      models.map(model => ({
        ...model,
        chainId,
        marketplaceAddress,
        marketplaceAbi,
      }))
    );
    // Apply search filter
    if (search) {
      const lower = search.toLowerCase();
      allModels = allModels.filter(
        m =>
          (m.name && m.name.toLowerCase().includes(lower)) ||
          (m.description && m.description.toLowerCase().includes(lower))
      );
    }
    // Apply custom filter function if provided
    if (typeof filterFn === "function") {
      allModels = allModels.filter(filterFn);
    }
    return allModels;
  }, [
    modelsByChain.map(m => m.models),
    search,
    filterFn,
    ...SUPPORTED_CHAINS
  ]);
}
