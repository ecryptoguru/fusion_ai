import { useState } from "react";
import { useAccount } from "wagmi";
import { useAllModels } from "../hooks/useAllModels";
import { useModelOwnership } from "../hooks/useModelOwnership";
import { useContractWrite } from "wagmi";

function ModelDashboardItem({ model }) {
  const { isOwner, isSubscriber, loading } = useModelOwnership(model);
  const [downloading, setDownloading] = useState(false);
  // Default discountEligible to false; in future, allow UI for user to claim discount
  const discountEligible = false;
  const { write: renewSubscription } = useContractWrite({
    address: model && model.chainId ? model.marketplaceAddress : undefined,
    abi: model && model.chainId ? model.marketplaceAbi : undefined,
    functionName: "renewSubscription",
  });

  // Download from IPFS (client-side check)
  const handleDownload = async () => {
    if (!isOwner && !isSubscriber) {
      alert("You do not have access to download this model.");
      return;
    }
    setDownloading(true);
    try {
      const url = `https://ipfs.io/ipfs/${model.ipfsHash}`;
      const a = document.createElement("a");
      a.href = url;
      a.download = model.name || "model.bin";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setDownloading(false);
    }
  };

  // Subscription renewal
  const handleRenew = () => {
    if (renewSubscription) {
      renewSubscription({ args: [model.id, discountEligible], value: model.subPrice });
    } else {
      alert("Subscription renewal is not available on this chain.");
    }
  };

  if (loading) return <div className="mb-2 border rounded p-2 animate-pulse">Checking ownership...</div>;
  if (!isOwner && !isSubscriber) return null;

  return (
    <div className="mb-2 border rounded p-2">
      <div className="font-bold">{model.name}</div>
      <div className="text-xs">Chain: {model.chainId}</div>
      <a href={`/model/${model.chainId}_${model.id}`} className="text-blue-600 underline">View Details</a>
      {(isOwner || isSubscriber) && (
        <button
          className="btn btn-secondary ml-2"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? "Downloading..." : "Download"}
        </button>
      )}
      {isSubscriber && (
        <button className="btn btn-primary ml-2" onClick={handleRenew}>Renew Subscription</button>
      )}
    </div>
  );
}

export default function UserDashboard() {
  const { address } = useAccount();
  const allModels = useAllModels();
  const [tab, setTab] = useState("purchased");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination logic
  const paginatedModels = allModels.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(allModels.length / itemsPerPage);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Dashboard</h1>
      <div className="flex gap-4 mb-4">
        <button onClick={() => setTab("purchased")} className={tab === "purchased" ? "font-bold underline" : ""}>Purchased</button>
        <button onClick={() => setTab("subscribed")} className={tab === "subscribed" ? "font-bold underline" : ""}>Subscribed</button>
      </div>
      {tab === "purchased" && (
        <div>
          <h2 className="font-semibold mb-2">Purchased Models</h2>
          {paginatedModels.map(m => <ModelDashboardItem key={`${m.chainId}-${m.id}`} model={m} />)}
        </div>
      )}
      {tab === "subscribed" && (
        <div>
          <h2 className="font-semibold mb-2">Subscribed Models</h2>
          {paginatedModels.map(m => <ModelDashboardItem key={`${m.chainId}-${m.id}`} model={m} />)}
        </div>
      )}
      {/* Pagination controls */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          className="btn btn-sm"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-2">Page {page} of {totalPages}</span>
        <button
          className="btn btn-sm"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
