import { Search, Coins } from 'lucide-react';

export default function ModelList({ models, onBuy, onSubscribe }) {
  return (
    <div>
      <div className="flex items-center mb-4">
        <Search className="w-5 h-5 mr-2" />
        <input className="input flex-1" placeholder="Search models..." />
      </div>
      <ul className="space-y-4">
        {models.map(model => (
          <li key={model.id} className="p-4 border rounded">
            <div className="font-bold">{model.name}</div>
            <div className="text-xs text-gray-500">{model.description}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Coins className="w-4 h-4" />
              <span>{model.price} (native token)</span>
              {model.discount && <span className="text-green-600 ml-2">10% discount</span>}
            </div>
            <div className="text-xs">Copies: {model.copiesSold}/{model.totalCopies} | Sub: {model.subPrice} ({model.subDuration}s)</div>
            <div className="flex space-x-2 mt-2">
              <button className="btn btn-success" onClick={() => onBuy(model.id)}>Buy</button>
              <button className="btn btn-info" onClick={() => onSubscribe(model.id)}>Subscribe</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
