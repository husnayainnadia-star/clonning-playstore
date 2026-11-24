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
  games:          { icon: Gamepad2,   color: "#4CAF50", bg: "#E8F5E9" },
  education:      { icon: BookOpen,   color: "#2196F3", bg: "#E3F2FD" },
  entertainment:  { icon: Tv,         color: "#FF9800", bg: "#FFF3E0" },
  social:         { icon: Users,      color: "#E91E63", bg: "#FCE4EC" },
  productivity:   { icon: Briefcase,  color: "#3F51B5", bg: "#E8EAF6" },
  photography:    { icon: Camera,     color: "#9C27B0", bg: "#F3E5F5" },
  finance:        { icon: DollarSign, color: "#009688", bg: "#E0F2F1" },
  lifestyle:      { icon: Sparkles,   color: "#FF5722", bg: "#FFF8E1" },
  "health-fitness": { icon: Heart,    color: "#F44336", bg: "#FFEBEE" },
  shopping:       { icon: ShoppingBag,color: "#00BCD4", bg: "#E0F7FA" },
  "music-audio":  { icon: Music,      color: "#673AB7", bg: "#EDE7F6" },
  tools:          { icon: Wrench,     color: "#607D8B", bg: "#F1F8E9" },
};

export default async function HomepageContent() {
  const [featuredApps, popularApps, trendingGames, newApps, editorApps, allBanners, allCategories] =
    await Promise.all([
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

  return (
    <div>
      {/* Banner */}
      {allBanners.length > 0 && <BannerCarousel banners={allBanners} />}

      {/* Categories grid */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top categories</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {allCategories.map((cat) => {
            const meta = CATEGORY_ICONS[cat.slug] || { icon: Sparkles, color: "#01875F", bg: "#E6F4EF" };
            const Icon = meta.icon;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white hover:shadow-sm transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: meta.bg }}
                >
                  <Icon className="h-6 w-6" style={{ color: meta.color }} />
                </div>
                <span className="text-xs text-gray-700 font-medium text-center leading-tight">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      {featuredApps.length > 0 && (
        <AppSection title="Featured" apps={featuredApps} viewAllHref="/charts" variant="scroll" />
      )}

      {/* Popular */}
      {popularApps.length > 0 && (
        <AppSection title="Popular apps & games" apps={popularApps} viewAllHref="/charts" variant="scroll" />
      )}

      {/* Top Charts card */}
      {popularApps.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top charts</h2>
            <Link href="/charts" className="text-sm text-[#01875F] font-medium hover:underline">
              See more
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {popularApps.slice(0, 5).map((app, i) => (
              <div key={app.id} className="flex items-center gap-3 px-4">
                <span className="text-sm font-bold text-gray-300 w-5 shrink-0">{i + 1}</span>
                <Link href={`/app/${app.slug}`} className="flex-1 flex items-center gap-3 py-3 hover:opacity-80 transition-opacity">
                  <img src={app.icon} alt={app.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{app.name}</div>
                    <div className="text-xs text-gray-500 truncate">{app.developer}</div>
                  </div>
                  <div className="text-xs text-[#01875F] font-medium shrink-0">
                    {app.isFree ? "Free" : `$${app.price}`}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trending Games */}
      {trendingGames.length > 0 && (
        <AppSection title="Trending games" apps={trendingGames} viewAllHref="/category/games" variant="scroll" />
      )}

      {/* Editor's Choice */}
      {editorApps.length > 0 && (
        <AppSection title="Editor's Choice" apps={editorApps} viewAllHref="/editors-choice" variant="scroll" />
      )}

      {/* New Releases */}
      {newApps.length > 0 && (
        <AppSection title="New releases" apps={newApps} viewAllHref="/new-releases" variant="scroll" />
      )}

      {/* Empty state jika belum ada data */}
      {popularApps.length === 0 && allCategories.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-[#E6F4EF] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#01875F]">
              <path d="M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zM3 14h7v7H3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Database belum dikonfigurasi</h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Isi <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">DATABASE_URL</code> di file <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">.env.local</code> dengan Neon connection string, lalu jalankan <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">npm run db:push</code> dan <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">npm run db:seed</code>
          </p>
        </div>
      )}
    </div>
  );
}
