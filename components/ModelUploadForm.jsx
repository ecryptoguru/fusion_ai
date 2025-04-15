import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { uploadModel, uploadMetadata } from "../lib/ipfsService";
import { useContractWrite } from "wagmi";
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from "../constants/contracts";

const CHAINS = [
  { id: 11155111, name: "Ethereum Sepolia" },
  { id: 43113, name: "Avalanche Fuji" },
  { id: 421614, name: "Arbitrum Sepolia" },
  { id: 97, name: "BSC Testnet" },
  { id: 80001, name: "Polygon Mumbai" },
  { id: 84532, name: "Base Sepolia" },
];

export default function ModelUploadForm() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    totalCopies: "",
    subPrice: "",
    subDuration: "",
    chainId: 11155111,
    file: null,
  });
  const [ipfsHash, setIpfsHash] = useState("");
  const [loading, setLoading] = useState(false);

  const { write: listModel } = useContractWrite({
    address: MARKETPLACE_ADDRESS[form.chainId],
    abi: MARKETPLACE_ABI,
    functionName: "listModel",
  });

  async function handleUpload(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const modelCid = await uploadModel(form.file);
      setIpfsHash(modelCid);
      const metadataCid = await uploadMetadata(
        form.name,
        form.description,
        form.price,
        modelCid,
        form.totalCopies,
        form.subPrice,
        form.subDuration
      );
      listModel({
        args: [
          form.name,
          form.description,
          form.price,
          metadataCid,
          form.totalCopies,
          form.subPrice,
          form.subDuration,
        ],
      });
      alert("Model listed!");
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
    setLoading(false);
  }

  return (
    <form className="space-y-4 max-w-lg mx-auto" onSubmit={handleUpload}>
      <Input className="input" placeholder="Model Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      <Input className="input" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
      <Input className="input" placeholder="Price (native token)" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
      <Input className="input" placeholder="Total Copies" type="number" value={form.totalCopies} onChange={e => setForm(f => ({ ...f, totalCopies: e.target.value }))} />
      <Input className="input" placeholder="Subscription Price" type="number" value={form.subPrice} onChange={e => setForm(f => ({ ...f, subPrice: e.target.value }))} />
      <Input className="input" placeholder="Subscription Duration (days)" type="number" value={form.subDuration} onChange={e => setForm(f => ({ ...f, subDuration: e.target.value }))} />
      <Select className="input" value={form.chainId} onChange={e => setForm(f => ({ ...f, chainId: Number(e.target.value) }))}>
        {CHAINS.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </Select>
      <Input className="input" type="file" accept=".bin,.pt,.onnx" onChange={e => setForm(f => ({ ...f, file: e.target.files[0] }))} />
      <Button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
        <Upload className="w-4 h-4" /> {loading ? "Uploading..." : "Upload & List"}
      </Button>
      {ipfsHash && <div className="text-xs break-all">IPFS Hash: {ipfsHash}</div>}
    </form>
  );
}
