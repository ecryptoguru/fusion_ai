// pages/api/reviews.js
// In-memory store for demo purposes (replace with DB for production)
let reviews = [];

export default function handler(req, res) {
  if (req.method === "GET") {
    // Query: ?modelId=chainId_id
    const { modelId } = req.query;
    const modelReviews = reviews.filter(r => r.modelId === modelId);
    res.status(200).json({ reviews: modelReviews });
  } else if (req.method === "POST") {
    const { modelId, user, rating, comment } = req.body;
    // Moderation: auto-flag if comment contains banned words (simple demo)
    const banned = ["spam", "scam", "offensive"];
    const flagged = banned.some(word => comment?.toLowerCase().includes(word));
    const review = {
      id: Date.now().toString(),
      modelId,
      user,
      rating,
      comment,
      flagged,
      createdAt: new Date().toISOString(),
    };
    reviews.push(review);
    res.status(201).json({ review });
  } else if (req.method === "DELETE") {
    // Admin moderation: delete by review id
    const { id } = req.body;
    reviews = reviews.filter(r => r.id !== id);
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}
