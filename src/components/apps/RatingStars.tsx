"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export default function RatingStars({
  rating,
  max = 5,
  size = "md",
  interactive = false,
  onRate,
}: RatingStarsProps) {
  const sizes = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-6 w-6" };
  const cls = sizes[size];

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(i + 1)}
            className={cn("relative", interactive && "cursor-pointer hover:scale-110 transition-transform")}
          >
            <Star
              className={cn(
                cls,
                filled ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
              )}
            />
            {partial && (
              <Star
                className={cn(cls, "fill-amber-400 text-amber-400 absolute inset-0")}
                style={{ clipPath: `inset(0 ${100 - (rating % 1) * 100}% 0 0)` }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
