import Link from "next/link";
import { ChevronRight } from "lucide-react";
import AppCard from "./AppCard";

interface App {
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
}

interface AppSectionProps {
  title: string;
  apps: App[];
  viewAllHref?: string;
  variant?: "grid" | "scroll" | "list";
}

export default function AppSection({ title, apps, viewAllHref, variant = "scroll" }: AppSectionProps) {
  if (!apps || apps.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-[22px] font-medium leading-7 tracking-[-0.01em] text-[#202124]">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-[#01875f] hover:bg-[#e6f4ef]"
          >
            See more <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {variant === "scroll" && (
        <div className="scrollbar-hide -mx-2 flex gap-1 overflow-x-auto px-2 pb-2">
          {apps.map((app) => (
            <div key={app.id} className="w-[132px] shrink-0 sm:w-[144px]">
              <AppCard {...app} variant="default" />
            </div>
          ))}
        </div>
      )}

      {variant === "grid" && (
        <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {apps.map((app) => (
            <AppCard key={app.id} {...app} variant="default" />
          ))}
        </div>
      )}

      {variant === "list" && (
        <div className="divide-y divide-[#f1f3f4] rounded-2xl border border-[#e8eaed] bg-white px-2">
          {apps.map((app, index) => (
            <div key={app.id} className="flex items-center gap-2">
              <span className="w-8 shrink-0 text-center text-sm text-[#5f6368]">{index + 1}</span>
              <div className="min-w-0 flex-1">
                <AppCard {...app} variant="horizontal" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
