"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { formatRating } from "@/lib/utils";

interface AppCardProps {
  id: number;
  name: string;
  slug: string;
  developer: string;
  icon: string;
  rating: string | number | null;
  downloads: number;
  isFree: boolean;
  price?: string | null;
  categoryName?: string;
  size?: string;
  variant?: "default" | "compact" | "horizontal";
}

export default function AppCard({
  id,
  name,
  slug,
  developer,
  icon,
  rating,
  downloads,
  isFree,
  price,
  categoryName,
  size,
  variant = "default",
}: AppCardProps) {
  const ratingValue = Number(rating) > 0 ? formatRating(rating) : null;

  if (variant === "horizontal") {
    return (
      <Link
        href={`/app/${slug}`}
        className="group flex items-center gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-[#f8f9fa]"
      >
        <img
          src={icon}
          alt={name}
          className="h-16 w-16 shrink-0 rounded-[22%] object-cover bg-gray-100 shadow-[0_1px_2px_rgba(60,64,67,.3),0_1px_3px_1px_rgba(60,64,67,.15)]"
          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-app.png"; }}
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-[#202124]">{name}</h3>
          <p className="truncate text-xs text-[#5f6368]">{developer}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-[#5f6368]">
            {ratingValue && (
              <span className="inline-flex items-center gap-0.5">
                {ratingValue} <Star className="h-3 w-3 fill-[#5f6368] text-[#5f6368]" />
              </span>
            )}
            {categoryName && <span className="truncate">{categoryName}</span>}
          </div>
        </div>
        <div className="shrink-0 text-xs font-medium text-[#5f6368]">
          {isFree ? "Free" : `$${price}`}
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/app/${slug}`} className="group flex w-24 flex-col gap-2">
        <img
          src={icon}
          alt={name}
          className="aspect-square w-full rounded-[22%] object-cover bg-gray-100 shadow-[0_1px_2px_rgba(60,64,67,.3),0_1px_3px_1px_rgba(60,64,67,.15)] transition-transform duration-200 group-hover:scale-[1.02]"
          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-app.png"; }}
        />
        <div>
          <h3 className="line-clamp-2 text-[13px] leading-4 text-[#202124]">{name}</h3>
          {ratingValue && (
            <div className="mt-1 flex items-center gap-0.5 text-xs text-[#5f6368]">
              <span>{ratingValue}</span>
              <Star className="h-3 w-3 fill-[#5f6368] text-[#5f6368]" />
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/app/${slug}`}
      className="group flex flex-col rounded-xl p-2 transition-colors hover:bg-[#f8f9fa]"
    >
      <img
        src={icon}
        alt={name}
        className="aspect-square w-full rounded-[22%] object-cover bg-gray-100 shadow-[0_1px_2px_rgba(60,64,67,.3),0_1px_3px_1px_rgba(60,64,67,.15)] transition-transform duration-200 group-hover:scale-[1.02]"
        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-app.png"; }}
      />
      <div className="mt-3 min-w-0">
        <h3 className="truncate text-[13px] font-normal leading-5 text-[#202124]">{name}</h3>
        <p className="truncate text-xs leading-4 text-[#5f6368]">{developer}</p>
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[#5f6368]">
          {ratingValue && (
            <span className="inline-flex items-center gap-0.5">
              {ratingValue}
              <Star className="h-3 w-3 fill-[#5f6368] text-[#5f6368]" />
            </span>
          )}
          {ratingValue && <span aria-hidden="true">·</span>}
          <span className="truncate">{isFree ? "Free" : `$${price}`}</span>
        </div>
      </div>
    </Link>
  );
}
