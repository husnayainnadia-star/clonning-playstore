import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
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

  const devices = ["Phone", "Tablet", "TV", "Chromebook", "Watch", "Car"];

  return (
    <div className="max-w-5xl">
      <h1 className="text-[32px] font-medium leading-tight tracking-[-0.01em] text-[#202124]">Top charts</h1>

      <div className="mt-5 flex flex-wrap gap-2">
        {devices.map((device, i) => (
          <span
            key={device}
            className={`inline-flex h-8 items-center rounded-full border px-4 text-sm ${
              i === 0
                ? "border-[#01875f] bg-[#e6f4ef] text-[#0b3d2e]"
                : "border-[#dadce0] bg-white text-[#5f6368]"
            }`}
          >
            {device}
          </span>
        ))}
      </div>

      <div className="mt-6 flex gap-2 border-b border-[#e8eaed]">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/charts?tab=${t.id}`}
            className={`relative px-3 pb-3 text-sm font-medium transition-colors ${
              tab === t.id ? "text-[#01875f]" : "text-[#5f6368] hover:text-[#202124]"
            }`}
          >
            {t.label}
            {tab === t.id && <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-[#01875f]" />}
          </Link>
        ))}
      </div>

      {apps.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-[#5f6368]">No apps yet. Configure your database and run the seed command.</p>
        </div>
      ) : (
        <div className="mt-2 divide-y divide-[#f1f3f4]">
          {apps.map((app, i) => (
            <Link
              key={app.id}
              href={`/app/${app.slug}`}
              className="flex items-center gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-[#f8f9fa]"
            >
              <span className="w-8 shrink-0 text-center text-sm text-[#5f6368]">{i + 1}</span>
              <img src={app.icon} alt={app.name} className="h-16 w-16 shrink-0 rounded-[22%] bg-gray-100 object-cover shadow-[0_1px_2px_rgba(60,64,67,.3)]" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-[#202124]">{app.name}</div>
                <div className="truncate text-xs text-[#5f6368]">{app.developer}</div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-[#5f6368]">
                  {Number(app.rating) > 0 && <span>{Number(app.rating).toFixed(1)} ★</span>}
                  {app.size && <span>{app.size}</span>}
                </div>
              </div>
              <div className="shrink-0 text-xs font-medium text-[#5f6368]">
                {app.isFree ? "Free" : `$${app.price}`}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
