import { Search, Star, Layers, Coins } from "lucide-react";
// import { Input, Select, Card } from "shadcn/ui";

export default function ModelList({ models, onSelect }) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {models.map(model => (
          <div
            key={model.id}
            onClick={() => onSelect(model.id)}
            className="p-6 border rounded-xl cursor-pointer hover:shadow-2xl bg-white transition-shadow duration-200 flex flex-col gap-2"
            style={{ minHeight: 220 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-5 h-5 text-blue-500" />
              <span className="font-bold text-lg text-gray-800">{model.name}</span>
            </div>
            <div className="text-sm text-gray-600 line-clamp-3 mb-2">{model.description}</div>
            <div className="flex items-center gap-2 text-sm text-gray-700 mt-auto">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold">{model.price}</span>
              <span className="text-xs text-gray-400 ml-2">Price</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Copies: {model.copiesSold}/{model.totalCopies}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>Rating: {model.ratingCount ? (model.ratingSum / model.ratingCount).toFixed(2) : "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <span>Chain:</span>
              <span className="font-mono">{model.chainId}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
