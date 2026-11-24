"use client";

import { useState } from "react";
import { Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import RatingStars from "@/components/apps/RatingStars";

interface Review {
  id: number;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: Date;
  userName: string | null;
  userEmail: string | null;
  appName: string | null;
  appId: number | null;
  appSlug: string | null;
}

export default function AdminReviewsTable({ reviews: initial }: { reviews: Review[] }) {
  const [reviews, setReviews] = useState(initial);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number, appId: number | null) => {
    if (!confirm("Delete this review?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/apps/${appId}/reviews/${id}`, { method: "DELETE" });
      setReviews((r) => r.filter((rv) => rv.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const filtered = reviews.filter(
    (r) =>
      r.appName?.toLowerCase().includes(search.toLowerCase()) ||
      r.userName?.toLowerCase().includes(search.toLowerCase()) ||
      r.body?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        type="search"
        placeholder="Search reviews..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm mb-4 h-9 px-3 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#01875F]/30"
      />

      <div className="space-y-3">
        {filtered.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <RatingStars rating={review.rating} size="sm" />
                  <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                </div>
                {review.title && (
                  <div className="text-sm font-medium text-gray-900 mb-1">{review.title}</div>
                )}
                {review.body && (
                  <p className="text-sm text-gray-600 line-clamp-2">{review.body}</p>
                )}
                <div className="mt-2 flex gap-3 text-xs text-gray-500">
                  <span>By: <strong>{review.userName || "Anonymous"}</strong></span>
                  <span>App: {review.appSlug ? (
                    <Link href={`/app/${review.appSlug}`} className="text-[#01875F] hover:underline">
                      {review.appName}
                    </Link>
                  ) : review.appName}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(review.id, review.appId)}
                disabled={deleting === review.id}
                className="p-1.5 rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">No reviews found</div>
        )}
      </div>
    </div>
  );
}
