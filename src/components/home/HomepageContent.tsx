// Paksa server component ini TIDAK di-prerender saat build
export const revalidate = 0;

import { db } from "@/lib/db";
import { applications, categories, banners } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import AppSection from "@/components/apps/AppSection";
import BannerCarousel from "@/components/apps/BannerCarousel";
import Link from "next/link";
import {
  Gamepad2, BookOpen, Tv, Users, Briefcase, Camera,
  DollarSign, Heart, ShoppingBag, Music, Wrench, Sparkles
} from "lucide-react";

const CATEGORY_ICONS: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  games:          { icon: Gamepad2,    color: "#4CAF50", bg: "#E8F5E9" },
  education:      { icon: BookOpen,    color: "#2196F3", bg: "#E3F2FD" },
  entertainment:  { icon: Tv,          color: "#FF9800", bg: "#FFF3E0" },
  social:         { icon: Users,       color: "#E91E63", bg: "#FCE4EC" },
  productivity:   { icon: Briefcase,   color: "#3F51B5", bg: "#E8EAF6" },
  photography:    { icon: Camera,      color: "#9C27B0", bg: "#F3E5F5" },
  finance:        { icon: DollarSign,  color: "#009688", bg: "#E0F2F1" },
  lifestyle:      { icon: Sparkles,    color: "#FF5722", bg: "#FFF8E1" },
  "health-fitness": { icon: Heart,     color: "#F44336", bg: "#FFEBEE" },
  shopping:       { icon: ShoppingBag, color: "#00BCD4", bg: "#E0F7FA" },
  "music-audio":  { icon: Music,       color: "#673AB7", bg: "#EDE7F6" },
  tools:          { icon: Wrench,      color: "#607D8B", bg: "#F1F8E9" },
};

type App = {
  id: number;
  name: string;
  slug: string;
  developer: string;
  icon: string;
  rating: string | null;
  downloads: number;
  isFree: boolean;
  price: string | null;
};

async function getHomeData() {
  try {
    const [
      featuredApps,
      popularApps,
      trendingGames,
      newApps,
      editorApps,
      allBanners,
      allCategories,
    ] = await Promise.all([
      db.select({
        id: applications.id, name: applications.name, slug: applications.slug,
        developer: applications.developer, icon: applications.icon,
        rating: applications.rating, downloads: applications.downloads,
        isFree: applications.isFree, price: applications.price,
      }).from(applications).where(eq(applications.isFeatured, true)).limit(10),

      db.select({
        id: applications.id, name: applications.name, slug: applications.slug,
        developer: applications.developer, icon: applications.icon,
        rating: applications.rating, downloads: applications.downloads,
        isFree: applications.isFree, price: applications.price,
      }).from(applications).where(eq(applications.isActive, true))
        .orderBy(desc(applications.downloads)).limit(12),

      db.select({
        id: applications.id, name: applications.name, slug: applications.slug,
        developer: applications.developer, icon: applications.icon,
        rating: applications.rating, downloads: applications.downloads,
        isFree: applications.isFree, price: applications.price,
      }).from(applications)
        .leftJoin(categories, eq(applications.categoryId, categories.id))
        .where(eq(categories.slug, "games"))
        .orderBy(desc(applications.downloads)).limit(10),

      db.select({
        id: applications.id, name: applications.name, slug: applications.slug,
        developer: applications.developer, icon: applications.icon,
        rating: applications.rating, downloads: applications.downloads,
        isFree: applications.isFree, price: applications.price,
      }).from(applications).where(eq(applications.isActive, true))
        .orderBy(desc(applications.createdAt)).limit(10),

      db.select({
        id: applications.id, name: applications.name, slug: applications.slug,
        developer: applications.developer, icon: applications.icon,
        rating: applications.rating, downloads: applications.downloads,
        isFree: applications.isFree, price: applications.price,
      }).from(applications).where(eq(applications.isEditor, true)).limit(10),

      db.select().from(banners).where(eq(banners.isActive, true)).limit(5),
      db.select().from(categories).limit(12),
    ]);

    return { featuredApps, popularApps, trendingGames, newApps, editorApps, allBanners, allCategories, error: false };
  } catch (err) {
    console.error("Homepage DB error:", err);
    return {
      featuredApps: [] as App[],
      popularApps: [] as App[],
      trendingGames: [] as App[],
      newApps: [] as App[],
      editorApps: [] as App[],
      allBanners: [],
      allCategories: [],
      error: true,
    };
  }
}

export default async function HomepageContent() {
  const { featuredApps, popularApps, trendingGames, newApps, editorApps, allBanners, allCategories, error } =
    await getHomeData();

  if (error || (popularApps.length === 0 && allCategories.length === 0)) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#e6f4ef]">
          <svg viewBox="0 0 24 24" className="h-10 w-10 fill-[#01875f]">
            <path d="M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zM3 14h7v7H3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-medium text-[#202124]">Welcome to Google Play</h2>
        <p className="mt-3 text-sm leading-6 text-[#5f6368]">
          Apps are loading. If this persists, check your <code className="rounded bg-[#f1f3f4] px-1.5 py-0.5 text-xs">DATABASE_URL</code> and seed data.
        </p>
        <Link href="/auth/signin" className="mt-6 inline-flex rounded-lg bg-[#01875f] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#056b4d]">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {allBanners.length > 0 && <BannerCarousel banners={allBanners} />}

      {allCategories.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-[22px] font-medium leading-7 tracking-[-0.01em] text-[#202124]">Browse by category</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {allCategories.map((cat) => {
              const meta = CATEGORY_ICONS[cat.slug] || { icon: Sparkles, color: "#01875F", bg: "#E6F4EF" };
              const Icon = meta.icon;
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-[#e8eaed] bg-white px-3 py-3 transition-colors hover:bg-[#f8f9fa]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: meta.bg }}>
                    <Icon className="h-5 w-5" style={{ color: meta.color }} />
                  </div>
                  <span className="min-w-0 truncate text-sm font-medium text-[#3c4043] group-hover:text-[#202124]">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {featuredApps.length > 0 && (
        <AppSection title="Featured apps" apps={featuredApps} viewAllHref="/charts" variant="scroll" />
      )}

      {popularApps.length > 0 && (
        <AppSection title="Popular apps & games" apps={popularApps} viewAllHref="/charts" variant="scroll" />
      )}

      {popularApps.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-[22px] font-medium leading-7 tracking-[-0.01em] text-[#202124]">Top charts</h2>
            <Link href="/charts" className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-[#01875f] hover:bg-[#e6f4ef]">
              See more
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#e8eaed] bg-white">
            {popularApps.slice(0, 5).map((app, i) => (
              <Link
                key={app.id}
                href={`/app/${app.slug}`}
                className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-[#f8f9fa] [&+&]:border-t [&+&]:border-[#f1f3f4]"
              >
                <span className="w-5 shrink-0 text-sm text-[#5f6368]">{i + 1}</span>
                <img src={app.icon} alt={app.name} className="h-14 w-14 shrink-0 rounded-[22%] bg-gray-100 object-cover shadow-[0_1px_2px_rgba(60,64,67,.3)]" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-[#202124]">{app.name}</div>
                  <div className="truncate text-xs text-[#5f6368]">{app.developer}</div>
                  <div className="mt-0.5 text-xs text-[#5f6368]">
                    {Number(app.rating) > 0 ? `${Number(app.rating).toFixed(1)} ★` : "New"} {app.isFree ? "· Free" : `· $${app.price}`}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {trendingGames.length > 0 && (
        <AppSection title="Trending games" apps={trendingGames} viewAllHref="/category/games" variant="scroll" />
      )}

      {editorApps.length > 0 && (
        <AppSection title="Editor&apos;s Choice" apps={editorApps} viewAllHref="/editors-choice" variant="scroll" />
      )}

      {newApps.length > 0 && (
        <AppSection title="New releases" apps={newApps} viewAllHref="/new-releases" variant="scroll" />
      )}
    </div>
  );
}
