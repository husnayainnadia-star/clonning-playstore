"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit2, Trash2, Eye, Star, Download } from "lucide-react";
import { formatRating } from "@/lib/utils";

interface App {
  id: number;
  name: string;
  slug: string;
  developer: string;
  icon: string;
  downloads: number | null;
  rating: string | null;
  reviewCount: number | null;
  isFree: boolean;
  isActive: boolean | null;
  isFeatured: boolean | null;
  isEditor: boolean | null;
  categoryName: string | null;
  createdAt: Date;
}

export default function AdminAppTable({ apps: initialApps }: { apps: App[] }) {
  const [apps, setApps] = useState(initialApps);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this app? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await fetch(`/api/apps/${id}`, { method: "DELETE" });
      setApps((a) => a.filter((app) => app.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const filtered = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.developer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        type="search"
        placeholder="Search apps..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm mb-4 h-9 px-3 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#01875F]/30"
      />

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">App</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Downloads</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Rating</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.icon}
                        alt={app.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate max-w-[150px]">{app.name}</div>
                        <div className="text-xs text-gray-500 truncate">{app.developer}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                    {app.categoryName || "—"}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Download className="h-3 w-3" />
                      {app.downloads?.toLocaleString() || 0}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {Number(app.rating) > 0 ? (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {formatRating(app.rating)}
                      </div>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        app.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {app.isActive ? "Active" : "Inactive"}
                      </span>
                      {app.isFeatured && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
                          Featured
                        </span>
                      )}
                      {app.isEditor && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">
                          Editor
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/app/${app.slug}`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/apps/${app.id}/edit`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#01875F]"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(app.id)}
                        disabled={deleting === app.id}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">No apps found</div>
        )}
      </div>
    </div>
  );
}
