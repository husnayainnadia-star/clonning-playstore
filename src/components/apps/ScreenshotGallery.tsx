"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ScreenshotGalleryProps {
  screenshots: string[];
  appName: string;
}

export default function ScreenshotGallery({ screenshots, appName }: ScreenshotGalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!screenshots || screenshots.length === 0) return null;

  const prev = () => setLightbox((i) => (i! - 1 + screenshots.length) % screenshots.length);
  const next = () => setLightbox((i) => (i! + 1) % screenshots.length);

  return (
    <>
      <section className="mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {screenshots.map((src, i) => (
            <button
              key={i}
              onClick={() => setLightbox(i)}
              className="shrink-0 rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
            >
              <img
                src={src}
                alt={`${appName} screenshot ${i + 1}`}
                className="h-52 w-auto rounded-xl object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <img
            src={screenshots[lightbox]}
            alt={`${appName} screenshot`}
            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 text-white/60 text-sm">
            {lightbox + 1} / {screenshots.length}
          </div>
        </div>
      )}
    </>
  );
}
