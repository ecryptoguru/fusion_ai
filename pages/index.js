import { useState } from "react";
import ModelList from "../components/ModelList";
import { useAllModels } from "../hooks/useAllModels";

export default function HomePage() {
  // UI state for search and filters
  const [search, setSearch] = useState("");
  const [chain, setChain] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Filtering logic passed to useAllModels
  const filterFn = model =>
    (!chain || model.chainId === Number(chain)) &&
    (!minPrice || Number(model.price) >= Number(minPrice)) &&
    (!maxPrice || Number(model.price) <= Number(maxPrice));

  const models = useAllModels({ search, filterFn });

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <span className="flex items-center border rounded px-2 py-1">
          <input
            className="outline-none"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </span>
        <select className="input" value={chain} onChange={e => setChain(e.target.value)}>
          <option value="">All Chains</option>
          <option value="11155111">Ethereum Sepolia</option>
          <option value="43113">Avalanche Fuji</option>
          <option value="421614">Arbitrum Sepolia</option>
          <option value="97">BSC Testnet</option>
          <option value="80001">Polygon Mumbai</option>
          <option value="84532">Base Sepolia</option>
        </select>
        <input
          className="input"
          placeholder="Min Price"
          type="number"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
        />
        <input
          className="input"
          placeholder="Max Price"
          type="number"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
        />
      </div>
      <ModelList models={models} onSelect={id => window.location.href = `/model/${id}`} />
    </div>
  );
}
