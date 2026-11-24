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
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm text-[#01875F] font-medium hover:underline"
          >
            See more <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {variant === "scroll" && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {apps.map((app) => (
            <div key={app.id} className="shrink-0 w-[120px]">
              <AppCard {...app} variant="default" />
            </div>
          ))}
        </div>
      )}

      {variant === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {apps.map((app) => (
            <AppCard key={app.id} {...app} variant="default" />
          ))}
        </div>
      )}

      {variant === "list" && (
        <div className="divide-y divide-gray-50">
          {apps.map((app, index) => (
            <div key={app.id} className="flex items-center gap-4 py-2">
              <span className="text-sm font-medium text-gray-400 w-6 text-center">{index + 1}</span>
              <div className="flex-1">
                <AppCard {...app} variant="horizontal" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
