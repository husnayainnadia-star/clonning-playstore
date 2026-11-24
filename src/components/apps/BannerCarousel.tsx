"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  appId: number | null;
}

interface BannerCarouselProps {
  banners: Banner[];
}

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  const prev = () => setCurrent((c) => (c - 1 + banners.length) % banners.length);
  const next = () => setCurrent((c) => (c + 1) % banners.length);

  return (
    <div className="group relative mb-10 overflow-hidden rounded-2xl border border-[#e8eaed] bg-[#f8f9fa]">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => {
          const href = banner.appId ? `/app/${banner.appId}` : banner.linkUrl || "#";
          return (
            <Link key={banner.id} href={href} className="relative w-full shrink-0">
              <div className="relative h-[220px] bg-gradient-to-br from-[#0b57d0] via-[#01875f] to-[#34a853] sm:h-[280px] lg:h-[320px]">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-white/80">Featured</p>
                  <h3 className="max-w-2xl text-2xl font-medium leading-tight sm:text-4xl">{banner.title}</h3>
                  {banner.subtitle && (
                    <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">{banner.subtitle}</p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {banners.length > 1 && (
        <>
          <button onClick={prev} aria-label="Previous banner" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[#3c4043] opacity-0 shadow transition-opacity hover:bg-white group-hover:opacity-100">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={next} aria-label="Next banner" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[#3c4043] opacity-0 shadow transition-opacity hover:bg-white group-hover:opacity-100">
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to banner ${i + 1}`}
                className={cn("h-2 rounded-full transition-all", i === current ? "w-6 bg-white" : "w-2 bg-white/55 hover:bg-white/80")}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
