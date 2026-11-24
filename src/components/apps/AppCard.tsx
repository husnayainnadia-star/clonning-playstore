"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { formatRating, formatDownloads } from "@/lib/utils";

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
  if (variant === "horizontal") {
    return (
      <Link href={`/app/${slug}`} className="group flex items-center gap-4 py-3 px-2 hover:bg-gray-50 rounded-xl transition-colors">
        <div className="relative shrink-0">
          <img
            src={icon}
            alt={name}
            className="w-14 h-14 rounded-2xl object-cover shadow-sm group-hover:shadow-md transition-shadow"
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-app.png"; }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{name}</h3>
          <p className="text-xs text-gray-500 truncate">{developer}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {rating && Number(rating) > 0 && (
              <div className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs text-gray-600">{formatRating(rating)}</span>
              </div>
            )}
            {categoryName && (
              <span className="text-xs text-gray-400">{categoryName}</span>
            )}
          </div>
        </div>
        <div className="text-xs text-[#01875F] font-medium shrink-0">
          {isFree ? "Free" : `$${price}`}
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/app/${slug}`} className="group flex flex-col items-center gap-2 w-20">
        <div className="relative">
          <img
            src={icon}
            alt={name}
            className="w-16 h-16 rounded-2xl object-cover shadow-sm group-hover:shadow-md transition-shadow"
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-app.png"; }}
          />
        </div>
        <div className="text-center">
          <h3 className="text-xs font-medium text-gray-800 leading-tight line-clamp-2">{name}</h3>
          {rating && Number(rating) > 0 && (
            <div className="flex items-center justify-center gap-0.5 mt-0.5">
              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
              <span className="text-[10px] text-gray-500">{formatRating(rating)}</span>
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/app/${slug}`} className="group flex flex-col gap-3 p-3 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer">
      <div className="relative">
        <img
          src={icon}
          alt={name}
          className="w-full aspect-square rounded-2xl object-cover shadow-sm group-hover:shadow-md transition-shadow"
          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-app.png"; }}
        />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-1">{name}</h3>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{developer}</p>
        <div className="flex items-center gap-2 mt-1">
          {rating && Number(rating) > 0 && (
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs text-gray-600">{formatRating(rating)}</span>
            </div>
          )}
          <span className="text-xs text-gray-400">
            {isFree ? "Free" : `$${price}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
