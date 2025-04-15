import { useState, useMemo } from "react";
import { useAllModels } from "../hooks/useAllModels";
import ModelList from "../components/ModelList";

const CHAIN_NAMES = {
  11155111: "Ethereum Sepolia",
  43113: "Avalanche Fuji",
  421614: "Arbitrum Sepolia",
  97: "BSC Testnet",
  80001: "Polygon Mumbai",
  84532: "Base Sepolia"
};

export default function AllModelsPage() {
  const allModels = useAllModels();
  const [search, setSearch] = useState("");
  const [chain, setChain] = useState("");
  const [sort, setSort] = useState("recent");

  // Filtering, search, and sorting
  const filtered = useMemo(() => {
    let models = allModels;
    if (chain) models = models.filter(m => String(m.chainId) === chain);
    if (search) models = models.filter(m =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.description?.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "price") models = [...models].sort((a, b) => Number(a.price) - Number(b.price));
    else if (sort === "copies") models = [...models].sort((a, b) => (b.copiesSold || 0) - (a.copiesSold || 0));
    else models = [...models].sort((a, b) => b.id - a.id); // recent by default
    return models;
  }, [allModels, chain, search, sort]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All AI Models (Multi-Chain)</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <input className="input" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="input" value={chain} onChange={e => setChain(e.target.value)}>
          <option value="">All Chains</option>
          {Object.entries(CHAIN_NAMES).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
        <select className="input" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="recent">Most Recent</option>
          <option value="price">Lowest Price</option>
          <option value="copies">Most Sold</option>
        </select>
      </div>
      {filtered.length === 0 && <div>No models found.</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map(model => (
          <div key={`${model.chainId}-${model.id}`} className="p-4 border rounded hover:shadow-lg">
            <div className="font-bold text-lg">{model.name}</div>
            <div className="text-xs text-gray-500 mb-2">{model.description}</div>
            <div className="text-sm">Chain: <span className="font-semibold">{CHAIN_NAMES[model.chainId]}</span></div>
            <div className="text-sm">Price: {model.price}</div>
            <div className="text-xs">Copies: {model.copiesSold}/{model.totalCopies}</div>
            <div className="text-xs">Rating: {model.ratingCount ? (model.ratingSum / model.ratingCount).toFixed(2) : "N/A"}</div>
            <a href={`/model/${model.chainId}_${model.id}`} className="inline-block mt-2 text-blue-600 underline">View Details</a>
          </div>
        ))}
      </div>
    </div>
  );
}
