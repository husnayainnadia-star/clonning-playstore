import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import AppCard from "@/components/apps/AppCard";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function ChartsPage({ searchParams }: PageProps) {
  const { tab = "top-free" } = await searchParams;

  const orderBy = tab === "top-rated"
    ? desc(applications.rating)
    : tab === "new"
    ? desc(applications.createdAt)
    : desc(applications.downloads);

  let apps: any[] = [];
  try {
    apps = await db
      .select({
        id: applications.id,
        name: applications.name,
        slug: applications.slug,
        developer: applications.developer,
        icon: applications.icon,
        rating: applications.rating,
        downloads: applications.downloads,
        isFree: applications.isFree,
        price: applications.price,
        size: applications.size,
      })
      .from(applications)
      .where(eq(applications.isActive, true))
      .orderBy(orderBy)
      .limit(50);
  } catch {
    // DB not configured yet
  }

  const tabs = [
    { id: "top-free", label: "Top free" },
    { id: "top-rated", label: "Top rated" },
    { id: "new", label: "New" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Top Charts</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-100 pb-0">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/charts?tab=${t.id}`}
            className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${
              tab === t.id
                ? "border-[#01875F] text-[#01875F]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {apps.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-sm">No apps yet. Configure your database and run the seed command.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {apps.map((app, i) => (
            <Link
              key={app.id}
              href={`/app/${app.slug}`}
              className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <span className="text-sm font-bold text-gray-300 w-7 text-center shrink-0">{i + 1}</span>
              <img src={app.icon} alt={app.name} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{app.name}</div>
                <div className="text-xs text-gray-500 truncate">{app.developer}</div>
                <div className="text-xs text-gray-400 mt-0.5">{app.size}</div>
              </div>
              <div className="text-sm font-medium text-[#01875F] shrink-0">
                {app.isFree ? "Free" : `$${app.price}`}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
