"use client";

import { CornerDownRight, MessageSquare, Star } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { tokens } from "@/lib/utils/tokens";
import { useReviews } from "../hooks/useReviews";

export const CustomerReviews: React.FC = () => {
  const { reviews, replyToReview, totalReviews, averageRating, distribution } = useReviews();

  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const handleSendReply = (reviewId: string) => {
    const text = replyText[reviewId];
    if (!text?.trim()) return;
    replyToReview(reviewId, text);
    setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
  };

  return (
    <div
      className={`rounded-2xl border ${tokens.colors.border} ${tokens.colors.cardBg} p-6 shadow-sm`}
    >
      <h3 className={`${tokens.fontSizes.heading} ${tokens.colors.textPrimary}`}>
        Customer Reviews
      </h3>
      <p className={`${tokens.fontSizes.body} ${tokens.colors.textMuted} mt-0.5`}>
        View customer ratings and respond to feedback.
      </p>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 border-b pb-6 border-zinc-200/60 dark:border-zinc-800">
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40">
          <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">
            {averageRating}
          </span>
          <div className="flex gap-0.5 my-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-4.5 w-4.5 ${s <= Math.round(Number(averageRating)) ? "fill-amber-400 text-amber-400" : "text-zinc-300"}`}
              />
            ))}
          </div>
          <span className={`${tokens.fontSizes.small} ${tokens.colors.textMuted}`}>
            {totalReviews} reviews today
          </span>
        </div>

        {/* Progress bars */}
        <div className="md:col-span-2 space-y-2 flex flex-col justify-center">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = distribution[stars - 1];
            const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-3 font-semibold text-zinc-700 dark:text-zinc-300">{stars}</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right text-zinc-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="mt-6 space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b last:border-0 pb-6 last:pb-0 border-zinc-100 dark:border-zinc-800/60"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-zinc-950 dark:text-white text-xs">
                  {review.customerName}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3 w-3 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-700"}`}
                      />
                    ))}
                  </div>
                  <span className={`${tokens.fontSizes.small} ${tokens.colors.textMuted}`}>
                    {review.date}
                  </span>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${tokens.colors.border} bg-zinc-50/50 dark:bg-zinc-900/40 text-zinc-500`}
              >
                {review.orderedItems.join(", ")}
              </span>
            </div>

            <p className="mt-2 text-zinc-700 dark:text-zinc-300 text-xs leading-relaxed">
              &ldquo;{review.comment}&rdquo;
            </p>

            {/* Merchant Reply */}
            {review.reply ? (
              <div className="mt-3.5 p-3 rounded-lg bg-zinc-50/60 dark:bg-zinc-900/30 border border-zinc-200/30 dark:border-zinc-800/20 flex gap-2">
                <CornerDownRight className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <span className={`${tokens.fontSizes.bodyBold} text-zinc-800 dark:text-zinc-200`}>
                    Your Response
                  </span>
                  <p className="text-zinc-650 dark:text-zinc-400 text-[11px] mt-0.5 italic">
                    &ldquo;{review.reply}&rdquo;
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-3.5 flex gap-2">
                <input
                  type="text"
                  placeholder="Respond to this review..."
                  value={replyText[review.id] || ""}
                  onChange={(e) =>
                    setReplyText((prev) => ({
                      ...prev,
                      [review.id]: e.target.value,
                    }))
                  }
                  className={`flex-1 rounded-lg border ${tokens.colors.border} bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-400`}
                />
                <button
                  onClick={() => handleSendReply(review.id)}
                  className={`rounded-lg bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white px-3 py-1.5 ${tokens.fontSizes.bodyBold} transition-colors cursor-pointer flex items-center gap-1 shadow-sm`}
                >
                  <MessageSquare className="h-3 w-3" /> Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;
