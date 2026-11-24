"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ThumbsUp, Edit2, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import RatingStars from "./RatingStars";
import { formatDate, formatRating } from "@/lib/utils";

interface Review {
  id: number;
  rating: number;
  title: string | null;
  body: string | null;
  thumbsUp: number;
  createdAt: string;
  user: { name: string | null; image: string | null; id: string };
}

interface ReviewSectionProps {
  appId: number;
  appName: string;
  avgRating: number;
  reviewCount: number;
  reviews: Review[];
  ratingBreakdown: Record<number, number>;
}

export default function ReviewSection({
  appId,
  appName,
  avgRating,
  reviewCount,
  reviews: initialReviews,
  ratingBreakdown,
}: ReviewSectionProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [myRating, setMyRating] = useState(0);
  const [myBody, setMyBody] = useState("");
  const [myTitle, setMyTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const myReview = reviews.find((r) => r.user.id === session?.user?.id);

  const handleSubmit = async () => {
    if (!session) { router.push("/auth/signin"); return; }
    if (myRating === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/apps/${appId}/reviews`, {
        method: myReview ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: myRating, title: myTitle, body: myBody }),
      });
      const data = await res.json();
      if (myReview) {
        setReviews((r) => r.map((rv) => (rv.id === myReview.id ? { ...rv, ...data } : rv)));
      } else {
        setReviews((r) => [data, ...r]);
      }
      setShowForm(false);
      setEditMode(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm("Delete your review?")) return;
    await fetch(`/api/apps/${appId}/reviews/${reviewId}`, { method: "DELETE" });
    setReviews((r) => r.filter((rv) => rv.id !== reviewId));
    router.refresh();
  };

  const handleThumbsUp = async (reviewId: number) => {
    if (!session) return;
    const res = await fetch(`/api/apps/${appId}/reviews/${reviewId}/thumbs`, { method: "POST" });
    const data = await res.json();
    setReviews((r) => r.map((rv) => (rv.id === reviewId ? { ...rv, thumbsUp: data.thumbsUp } : rv)));
  };

  const startEdit = () => {
    if (myReview) {
      setMyRating(myReview.rating);
      setMyTitle(myReview.title || "");
      setMyBody(myReview.body || "");
      setEditMode(true);
      setShowForm(true);
    }
  };

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Ratings & Reviews</h2>

      {/* Rating overview */}
      <div className="flex gap-8 mb-6 p-4 bg-gray-50 rounded-2xl">
        <div className="text-center">
          <div className="text-5xl font-light text-gray-900">{formatRating(avgRating)}</div>
          <RatingStars rating={avgRating} size="sm" />
          <div className="text-xs text-gray-500 mt-1">{reviewCount.toLocaleString()} reviews</div>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingBreakdown[star] || 0;
            const pct = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-3">{star}</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <Progress value={pct} className="flex-1 h-1.5" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Write a review */}
      {session && !myReview && !showForm && (
        <Button
          variant="outline"
          onClick={() => setShowForm(true)}
          className="mb-6 w-full sm:w-auto"
        >
          Write a Review
        </Button>
      )}

      {showForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-2xl">
          <h3 className="font-medium mb-3">{editMode ? "Edit your review" : "Rate this app"}</h3>
          <div className="mb-3">
            <RatingStars
              rating={myRating}
              size="lg"
              interactive
              onRate={setMyRating}
            />
          </div>
          <input
            value={myTitle}
            onChange={(e) => setMyTitle(e.target.value)}
            placeholder="Review title (optional)"
            className="w-full mb-2 h-9 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#01875F]/30"
          />
          <Textarea
            value={myBody}
            onChange={(e) => setMyBody(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
            className="mb-3"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmit} disabled={submitting || myRating === 0}>
              {submitting ? "Submitting..." : editMode ? "Update" : "Submit"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setShowForm(false); setEditMode(false); }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-6">
        {reviews.slice(0, 10).map((review) => (
          <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={review.user.image || ""} />
                  <AvatarFallback className="bg-[#01875F]/10 text-[#01875F] text-sm">
                    {review.user.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-gray-900">{review.user.name || "Anonymous"}</div>
                  <div className="text-xs text-gray-400">{formatDate(review.createdAt)}</div>
                </div>
              </div>
              {review.user.id === session?.user?.id && (
                <div className="flex gap-1">
                  <button onClick={startEdit} className="p-1.5 rounded-full hover:bg-gray-100">
                    <Edit2 className="h-3.5 w-3.5 text-gray-400" />
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="p-1.5 rounded-full hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  </button>
                </div>
              )}
            </div>
            <RatingStars rating={review.rating} size="sm" />
            {review.title && (
              <p className="mt-1.5 text-sm font-medium text-gray-900">{review.title}</p>
            )}
            {review.body && (
              <p className="mt-1 text-sm text-gray-600 leading-relaxed">{review.body}</p>
            )}
            <button
              onClick={() => handleThumbsUp(review.id)}
              className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#01875F] transition-colors"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Helpful ({review.thumbsUp})
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
