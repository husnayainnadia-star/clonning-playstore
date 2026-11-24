
import { db } from "@/lib/db";
import { applications, categories, reviews, users } from "@/lib/db/schema";
import { eq, avg, count, desc, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { formatDownloads, formatDate, formatRating } from "@/lib/utils";
import InstallButton from "@/components/apps/InstallButton";
import ReviewSection from "@/components/apps/ReviewSection";
import AppSection from "@/components/apps/AppSection";
import RatingStars from "@/components/apps/RatingStars";
import { Badge } from "@/components/ui/badge";
import { Star, Download, Shield, Calendar, Smartphone, Globe } from "lucide-react";
import Link from "next/link";
import ScreenshotGallery from "@/components/apps/ScreenshotGallery";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getApp(slug: string) {
  const [app] = await db
    .select({
      id: applications.id,
      name: applications.name,
      slug: applications.slug,
      developer: applications.developer,
      icon: applications.icon,
      screenshots: applications.screenshots,
      description: applications.description,
      whatsNew: applications.whatsNew,
      version: applications.version,
      size: applications.size,
      minAndroid: applications.minAndroid,
      downloads: applications.downloads,
      rating: applications.rating,
      reviewCount: applications.reviewCount,
      isFree: applications.isFree,
      price: applications.price,
      contentRating: applications.contentRating,
      isEditor: applications.isEditor,
      website: applications.website,
      lastUpdated: applications.lastUpdated,
      categoryId: applications.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(applications)
    .leftJoin(categories, eq(applications.categoryId, categories.id))
    .where(eq(applications.slug, slug))
    .limit(1);

  return app;
}

export default async function AppDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const app = await getApp(slug);
  if (!app) notFound();

  // Get reviews
  const appReviews = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      thumbsUp: reviews.thumbsUp,
      createdAt: reviews.createdAt,
      user: { id: users.id, name: users.name, image: users.image },
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.appId, app.id))
    .orderBy(desc(reviews.thumbsUp))
    .limit(10);

  // Rating breakdown
  const breakdown: Record<number, number> = {};
  for (let i = 1; i <= 5; i++) {
    const [result] = await db
      .select({ cnt: count() })
      .from(reviews)
      .where(sql`${reviews.appId} = ${app.id} AND ${reviews.rating} = ${i}`);
    breakdown[i] = result.cnt;
  }

  // Similar apps
  const similarApps = await db
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
    })
    .from(applications)
    .where(eq(applications.categoryId, app.categoryId!))
    .limit(10);

  const screenshots = app.screenshots || [];

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1">
        <Link href="/" className="hover:text-[#01875F]">Home</Link>
        <span>/</span>
        {app.categorySlug && (
          <>
            <Link href={`/category/${app.categorySlug}`} className="hover:text-[#01875F]">
              {app.categoryName}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 truncate">{app.name}</span>
      </nav>

      {/* App Header */}
      <div className="flex items-start gap-5 mb-6">
        <img
          src={app.icon}
          alt={app.name}
          className="w-24 h-24 rounded-2xl object-cover shadow-md shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-app.png"; }}
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{app.name}</h1>
          <Link
            href={`/search?developer=${encodeURIComponent(app.developer)}`}
            className="text-[#01875F] text-sm font-medium hover:underline mt-1 block"
          >
            {app.developer}
          </Link>
          {app.categoryName && (
            <Link href={`/category/${app.categorySlug}`}>
              <Badge variant="outline" className="mt-2 text-xs">
                {app.categoryName}
              </Badge>
            </Link>
          )}
          {app.isEditor && (
            <Badge className="mt-1 ml-1 text-xs bg-amber-100 text-amber-700 border-0">
              Editor's Choice
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-6 py-4 border-y border-gray-100 mb-6 overflow-x-auto">
        {Number(app.rating) > 0 && (
          <div className="flex flex-col items-center shrink-0">
            <div className="flex items-center gap-1">
              <span className="text-lg font-semibold">{formatRating(app.rating)}</span>
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs text-gray-500">{app.reviewCount?.toLocaleString()} reviews</span>
          </div>
        )}
        <div className="w-px h-10 bg-gray-100 shrink-0" />
        <div className="flex flex-col items-center shrink-0">
          <span className="text-lg font-semibold">{formatDownloads(app.downloads || 0)}</span>
          <span className="text-xs text-gray-500">Downloads</span>
        </div>
        <div className="w-px h-10 bg-gray-100 shrink-0" />
        <div className="flex flex-col items-center shrink-0">
          <span className="text-lg font-semibold">{app.contentRating}</span>
          <span className="text-xs text-gray-500">Rated for</span>
        </div>
        <div className="w-px h-10 bg-gray-100 shrink-0" />
        <div className="flex flex-col items-center shrink-0">
          <span className="text-lg font-semibold">{app.size}</span>
          <span className="text-xs text-gray-500">Size</span>
        </div>
      </div>

      {/* Install Button */}
      <div className="mb-6">
        <InstallButton
          appId={app.id}
          appName={app.name}
          isFree={app.isFree}
          price={app.price}
          size="lg"
        />
      </div>

      {/* Screenshots */}
      {screenshots.length > 0 && (
        <ScreenshotGallery screenshots={screenshots} appName={app.name} />
      )}

      {/* Description */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">About this app</h2>
        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {app.description}
        </div>
      </section>

      {/* What's New */}
      {app.whatsNew && (
        <section className="mb-6 p-4 bg-gray-50 rounded-2xl">
          <h2 className="text-base font-semibold text-gray-900 mb-2">What's new</h2>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{app.whatsNew}</p>
        </section>
      )}

      {/* App info */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">App info</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Version", value: app.version, icon: null },
            { label: "Updated", value: formatDate(app.lastUpdated), icon: Calendar },
            { label: "Size", value: app.size, icon: null },
            { label: "Requires Android", value: app.minAndroid, icon: Smartphone },
            { label: "Downloads", value: formatDownloads(app.downloads || 0), icon: Download },
            { label: "Content rating", value: app.contentRating, icon: Shield },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-500">{label}</span>
              <span className="text-sm font-medium text-gray-900">{value || "—"}</span>
            </div>
          ))}
        </div>
        {app.website && (
          <a
            href={app.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-2 text-sm text-[#01875F] hover:underline"
          >
            <Globe className="h-4 w-4" /> Visit website
          </a>
        )}
      </section>

      {/* Reviews */}
      <ReviewSection
        appId={app.id}
        appName={app.name}
        avgRating={Number(app.rating) || 0}
        reviewCount={app.reviewCount || 0}
        reviews={appReviews as any}
        ratingBreakdown={breakdown}
      />

      {/* Similar Apps */}
      {similarApps.length > 1 && (
        <div className="mt-10">
          <AppSection
            title="Similar apps"
            apps={similarApps.filter((a) => a.slug !== slug)}
            variant="scroll"
          />
        </div>
      )}
    </div>
  );
}
