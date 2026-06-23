import { useState } from "react";
import type { Review } from "@/types";

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      customerName: "Aarav Sharma",
      rating: 5,
      date: "Today, 1:45 PM",
      comment:
        "Absolutely delicious! The butter chicken was rich, creamy, and delivered piping hot. Highly recommend!",
      orderedItems: ["Butter Chicken Meal", "Garlic Naan"],
    },
    {
      id: "2",
      customerName: "Neha Gupta",
      rating: 4,
      date: "Yesterday, 8:20 PM",
      comment:
        "Food quality was excellent, but the packaging could have been slightly better to prevent naans from getting soggy.",
      orderedItems: ["Veg Biryani", "Mango Lassi"],
      reply:
        "Thank you for the feedback, Neha! We are working on optimizing our packaging for naans to ensure they stay fresh.",
    },
    {
      id: "3",
      customerName: "Rohan Nair",
      rating: 2,
      date: "2 days ago",
      comment:
        "Very disappointed with the delivery speed. The food arrived cold. The paneer tikka was great, but delivery let it down.",
      orderedItems: ["Paneer Tikka Roll"],
    },
  ]);

  const replyToReview = (reviewId: string, reply: string) => {
    if (!reply.trim()) return;
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, reply: reply.trim() } : r)));
  };

  const totalReviews = reviews.length;
  const averageRating = (
    totalReviews > 0 ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews : 0
  ).toFixed(1);

  // Distribution counts (1 to 5 star counts)
  const distribution = [0, 0, 0, 0, 0];
  for (const r of reviews) {
    if (r.rating >= 1 && r.rating <= 5) {
      distribution[r.rating - 1]++;
    }
  }

  return {
    reviews,
    replyToReview,
    totalReviews,
    averageRating,
    distribution,
  };
};

export default useReviews;
