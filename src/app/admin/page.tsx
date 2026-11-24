
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { applications, users, reviews, installations, categories } from "@/lib/db/schema";
import { count, sum, desc } from "drizzle-orm";
import Link from "next/link";
import { Package, Users, Star, Download, Plus, Settings } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") {
    redirect("/");
  }

  const [[{ totalApps }], [{ totalUsers }], [{ totalReviews }], [{ totalDownloads }],
    recentApps, recentUsers] = await Promise.all([
    db.select({ totalApps: count() }).from(applications),
    db.select({ totalUsers: count() }).from(users),
    db.select({ totalReviews: count() }).from(reviews),
    db.select({ totalDownloads: sum(applications.downloads) }).from(applications),
    db.select({
      id: applications.id, name: applications.name, slug: applications.slug,
      icon: applications.icon, downloads: applications.downloads, isActive: applications.isActive,
    }).from(applications).orderBy(desc(applications.createdAt)).limit(5),
    db.select({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt })
      .from(users).orderBy(desc(users.createdAt)).limit(5),
  ]);

  const stats = [
    { label: "Total Apps", value: totalApps.toLocaleString(), icon: Package, color: "bg-blue-50 text-blue-600", href: "/admin/apps" },
    { label: "Total Users", value: totalUsers.toLocaleString(), icon: Users, color: "bg-green-50 text-[#01875F]", href: "/admin/users" },
    { label: "Total Reviews", value: totalReviews.toLocaleString(), icon: Star, color: "bg-amber-50 text-amber-600", href: "/admin/reviews" },
    { label: "Total Downloads", value: Number(totalDownloads || 0).toLocaleString(), icon: Download, color: "bg-purple-50 text-purple-600", href: "#" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your Play Store</p>
        </div>
        <Link
          href="/admin/apps/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#01875F] text-white rounded-full text-sm font-medium hover:bg-[#016d4d] transition-colors"
        >
          <Plus className="h-4 w-4" /> Add App
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </Link>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Apps */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Apps</h2>
            <Link href="/admin/apps" className="text-xs text-[#01875F] hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentApps.map((app) => (
              <div key={app.id} className="flex items-center gap-3">
                <img src={app.icon} alt={app.name} className="w-10 h-10 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{app.name}</div>
                  <div className="text-xs text-gray-500">{app.downloads?.toLocaleString()} downloads</div>
                </div>
                <Link href={`/admin/apps/${app.id}/edit`} className="p-1.5 rounded-lg hover:bg-gray-100">
                  <Settings className="h-3.5 w-3.5 text-gray-400" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Users</h2>
            <Link href="/admin/users" className="text-xs text-[#01875F] hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#01875F]/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-[#01875F]">
                    {user.name?.[0]?.toUpperCase() || "?"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                  <div className="text-xs text-gray-500 truncate">{user.email}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Manage Apps", href: "/admin/apps", icon: Package },
          { label: "Manage Users", href: "/admin/users", icon: Users },
          { label: "Manage Reviews", href: "/admin/reviews", icon: Star },
        ].map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-sm transition-shadow"
          >
            <Icon className="h-5 w-5 text-[#01875F]" />
            <span className="text-sm font-medium text-gray-900">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
