
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { reviews, users, applications } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import AdminReviewsTable from "@/components/admin/AdminReviewsTable";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminReviewsPage() {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") redirect("/");

  const allReviews = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      createdAt: reviews.createdAt,
      userName: users.name,
      userEmail: users.email,
      appName: applications.name,
      appId: applications.id,
      appSlug: applications.slug,
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .leftJoin(applications, eq(reviews.appId, applications.id))
    .orderBy(desc(reviews.createdAt));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Manage Reviews ({allReviews.length})</h1>
      </div>
      <AdminReviewsTable reviews={allReviews} />
    </div>
  );
}
