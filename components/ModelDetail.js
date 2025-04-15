import { Coins, Flag, Eye, Clock, Copy } from 'lucide-react';

export default function ModelDetail({ model, isDiscount, onBuy, onSubscribe, onReport }) {
  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <Eye className="w-5 h-5" />
        <span className="font-bold text-lg">{model.name}</span>
      </div>
      <div className="mb-2">{model.description}</div>
      <div className="flex items-center space-x-2 mb-2">
        <Coins className="w-4 h-4" />
        <span>{model.price} (native token)</span>
        {isDiscount && <span className="text-green-600 ml-2">10% discount active</span>}
      </div>
      <div className="text-xs mb-2">Copies: <Copy className="inline w-3 h-3" /> {model.copiesSold}/{model.totalCopies} | Sub: {model.subPrice} ({model.subDuration}s) <Clock className="inline w-3 h-3" /></div>
      <div className="flex space-x-2 mt-2">
        <button className="btn btn-success" onClick={onBuy}>Buy</button>
        <button className="btn btn-info" onClick={onSubscribe}>Subscribe</button>
        <button className="btn btn-warning" onClick={onReport}><Flag className="w-4 h-4 mr-1 inline" />Report</button>
      </div>
    </div>
  );
}
