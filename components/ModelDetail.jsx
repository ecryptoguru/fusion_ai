import { useState } from "react";
import { Coins, Flag, Download, Star } from "lucide-react";
import { useContractWrite } from "wagmi";
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from "../constants/contracts";
import Toast from "./Toast";
import ReviewSection from "./ReviewSection";

export default function ModelDetail({ model, onBuy, onSubscribe, onReport, isDiscount }) {
  const [toast, setToast] = useState({ message: "", type: "info" });
  const [loading, setLoading] = useState("");
  const [rating, setRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  const { write: buyModel } = useContractWrite({
    address: MARKETPLACE_ADDRESS[model.chainId],
    abi: MARKETPLACE_ABI,
    functionName: "buyModel",
    onSuccess: () => setToast({ message: "Purchase successful!", type: "success" }),
    onError: (e) => setToast({ message: e.message, type: "error" })
  });
  const { write: subscribeModel } = useContractWrite({
    address: MARKETPLACE_ADDRESS[model.chainId],
    abi: MARKETPLACE_ABI,
    functionName: "subscribeModel",
    onSuccess: () => setToast({ message: "Subscription successful!", type: "success" }),
    onError: (e) => setToast({ message: e.message, type: "error" })
  });
  const { write: reportModel } = useContractWrite({
    address: MARKETPLACE_ADDRESS[model.chainId],
    abi: MARKETPLACE_ABI,
    functionName: "reportModel",
    onSuccess: () => setToast({ message: "Model reported.", type: "success" }),
    onError: (e) => setToast({ message: e.message, type: "error" })
  });
  const { write: rateModel } = useContractWrite({
    address: MARKETPLACE_ADDRESS[model.chainId],
    abi: MARKETPLACE_ABI,
    functionName: "rateModel",
    onSuccess: () => {
      setToast({ message: "Rating submitted!", type: "success" });
      setSubmittingRating(false);
      setRating(0);
    },
    onError: (e) => {
      setToast({ message: e.message, type: "error" });
      setSubmittingRating(false);
    }
  });

  const handleBuy = () => {
    setLoading("buy");
    buyModel({ args: [model.id, isDiscount], value: model.price });
    if (onBuy) onBuy();
  };
  const handleSubscribe = () => {
    setLoading("subscribe");
    subscribeModel({ args: [model.id, isDiscount], value: model.subPrice });
    if (onSubscribe) onSubscribe();
  };
  const handleReport = () => {
    setLoading("report");
    reportModel({ args: [model.id] });
    if (onReport) onReport();
  };

  // Download from IPFS
  const handleDownload = async () => {
    setLoading("download");
    try {
      const url = `https://ipfs.io/ipfs/${model.ipfsHash}`;
      const a = document.createElement("a");
      a.href = url;
      a.download = model.name || "model.bin";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setToast({ message: "Download started.", type: "success" });
    } catch (e) {
      setToast({ message: "Download failed.", type: "error" });
    }
    setLoading("");
  };

  // Submit rating
  const handleRate = () => {
    if (rating < 1 || rating > 5) {
      setToast({ message: "Please select a rating (1-5 stars)", type: "error" });
      return;
    }
    setSubmittingRating(true);
    rateModel({ args: [model.id, rating] });
  };

  return (
    <div className="p-6 border rounded-lg max-w-xl mx-auto">
      {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "" })} />}
      <div className="font-bold text-xl">{model.name}</div>
      <div className="mb-2">{model.description}</div>
      <div className="mb-2">Price: {model.price} {isDiscount && <span className="text-green-600">(10% Discount)</span>}</div>
      <div className="mb-2">Subscription: {model.subPrice} / {model.subDuration} days</div>
      <div className="mb-2">Copies: {model.copiesSold}/{model.totalCopies}</div>
      <div className="mb-2">IPFS Hash: <a href={`https://ipfs.io/ipfs/${model.ipfsHash}`} target="_blank" rel="noopener noreferrer" className="underline">{model.ipfsHash}</a></div>
      <div className="mb-2">Rating: {model.ratingCount ? (model.ratingSum / model.ratingCount).toFixed(2) : "N/A"}</div>
      <div className="flex gap-2 mt-4">
        <button onClick={handleBuy} className="btn btn-success flex items-center" disabled={loading === "buy"}><Coins className="w-4 h-4 mr-1" /> {loading === "buy" ? "Buying..." : "Buy"}</button>
        <button onClick={handleSubscribe} className="btn btn-info" disabled={loading === "subscribe"}>{loading === "subscribe" ? "Subscribing..." : "Subscribe"}</button>
        <button onClick={handleReport} className="btn btn-warning flex items-center" disabled={loading === "report"}><Flag className="w-4 h-4 mr-1" /> {loading === "report" ? "Reporting..." : "Report"}</button>
        <button onClick={handleDownload} className="btn btn-secondary flex items-center" disabled={loading === "download"}><Download className="w-4 h-4 mr-1" /> Download</button>
      </div>
      {/* Rating UI */}
      <div className="mt-6">
        <div className="font-semibold mb-1">Rate this model:</div>
        <div className="flex items-center gap-1 mb-2">
          {[1,2,3,4,5].map(star => (
            <button
              key={star}
              type="button"
              className={
                star <= rating
                  ? "text-yellow-400"
                  : "text-gray-300"
              }
              onClick={() => setRating(star)}
              disabled={submittingRating}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <Star className="w-6 h-6" fill={star <= rating ? "#facc15" : "none"} />
            </button>
          ))}
          <span className="ml-2 text-sm">{rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : "Select"}</span>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleRate}
          disabled={submittingRating || rating === 0}
        >
          {submittingRating ? "Submitting..." : "Submit Rating"}
        </button>
      </div>
      {/* Off-chain reviews */}
      <ReviewSection modelId={`${model.chainId}_${model.id}`} />
    </div>
  );
}
