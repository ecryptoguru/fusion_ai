import { useState } from 'react';
import { Copy, Clock } from 'lucide-react';

export default function ModelUploadForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    totalCopies: '',
    subPrice: '',
    subDuration: '',
    chain: 'ethereumSepolia',
  });
  return (
    <form className="space-y-4" onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <input className="input" placeholder="Model Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      <textarea className="input" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
      <input className="input" placeholder="Price (native token)" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
      <div className="flex items-center space-x-2"><Copy className="w-4 h-4" /><input className="input flex-1" placeholder="Total Copies" type="number" value={form.totalCopies} onChange={e => setForm(f => ({ ...f, totalCopies: e.target.value }))} /></div>
      <div className="flex items-center space-x-2"><Clock className="w-4 h-4" /><input className="input flex-1" placeholder="Subscription Price (native token)" type="number" value={form.subPrice} onChange={e => setForm(f => ({ ...f, subPrice: e.target.value }))} /></div>
      <input className="input" placeholder="Subscription Duration (seconds)" type="number" value={form.subDuration} onChange={e => setForm(f => ({ ...f, subDuration: e.target.value }))} />
      <select className="input" value={form.chain} onChange={e => setForm(f => ({ ...f, chain: e.target.value }))}>
        <option value="ethereumSepolia">Ethereum Sepolia</option>
        <option value="avalancheFuji">Avalanche Fuji</option>
        <option value="arbitrumSepolia">Arbitrum Sepolia</option>
        <option value="bscTestnet">BSC Testnet</option>
        <option value="polygonMumbai">Polygon Mumbai</option>
        <option value="baseSepolia">Base Sepolia</option>
      </select>
      <button className="btn btn-primary w-full" type="submit">Upload Model</button>
    </form>
  );
}
