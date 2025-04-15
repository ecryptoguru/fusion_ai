import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Toast from "./Toast";

export default function ReviewSection({ modelId }) {
  const { address } = useAccount();
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });

  // Fetch reviews
  useEffect(() => {
    fetch(`/api/reviews?modelId=${modelId}`)
      .then(res => res.json())
      .then(data => setReviews(data.reviews || []));
  }, [modelId]);

  // Submit review
  const handleSubmit = async e => {
    e.preventDefault();
    if (!comment.trim() || !rating) {
      setToast({ message: "Please provide a rating and comment.", type: "error" });
      return;
    }
    setLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modelId, user: address, rating, comment })
    });
    const data = await res.json();
    if (res.ok) {
      setReviews(r => [data.review, ...r]);
      setComment("");
      setRating(0);
      setToast({ message: "Review submitted!", type: "success" });
    } else {
      setToast({ message: data.error || "Failed to submit review.", type: "error" });
    }
    setLoading(false);
  };

  // Admin: delete review
  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    await fetch("/api/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    setReviews(r => r.filter(rv => rv.id !== id));
    setToast({ message: "Review deleted.", type: "success" });
  };

  return (
    <div className="mt-8">
      {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "" })} />}
      <h3 className="font-bold mb-2 text-lg">User Reviews</h3>
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 mb-2">
          {[1,2,3,4,5].map(star => (
            <button
              key={star}
              type="button"
              className={star <= rating ? "text-yellow-400" : "text-gray-300"}
              onClick={() => setRating(star)}
              disabled={loading}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <svg className="w-5 h-5" fill={star <= rating ? "#facc15" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.262a1 1 0 00.95.69h6.6c.969 0 1.371 1.24.588 1.81l-5.347 3.89a1 1 0 00-.364 1.118l2.036 6.262c.3.921-.755 1.688-1.54 1.118l-5.347-3.89a1 1 0 00-1.176 0l-5.347 3.89c-.784.57-1.838-.197-1.539-1.118l2.036-6.262a1 1 0 00-.364-1.118l-5.347-3.89c-.783-.57-.38-1.81.588-1.81h6.6a1 1 0 00.95-.69l2.036-6.262z" /></svg>
            </button>
          ))}
        </div>
        <textarea
          className="input w-full mb-2"
          rows={3}
          placeholder="Write your review..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          disabled={loading}
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Review"}</button>
      </form>
      <div className="space-y-4">
        {reviews.length === 0 && <div>No reviews yet.</div>}
        {reviews.map(rv => (
          <div key={rv.id} className={`border rounded p-2 ${rv.flagged ? "bg-red-50" : ""}`}>
            <div className="flex items-center gap-2">
              <span className="font-bold">{rv.user?.slice(0, 6)}...{rv.user?.slice(-4)}</span>
              <span className="text-yellow-500">{"★".repeat(rv.rating)}<span className="text-gray-300">{"★".repeat(5 - rv.rating)}</span></span>
              <span className="text-xs text-gray-500 ml-2">{new Date(rv.createdAt).toLocaleString()}</span>
              {rv.flagged && <span className="ml-2 text-xs text-red-600 font-bold">Flagged</span>}
              {/* Moderation: show delete for admin (for demo, anyone can delete) */}
              <button className="ml-auto text-xs text-red-600 underline" onClick={() => handleDelete(rv.id)}>Delete</button>
            </div>
            <div className="ml-2 text-sm mt-1">{rv.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
