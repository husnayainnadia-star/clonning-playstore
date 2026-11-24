"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Download, Package, Trash2, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface LibraryItem {
  installId: number;
  status: string;
  installedAt: string;
  app: {
    id: number;
    name: string;
    slug: string;
    developer: string;
    icon: string;
    rating: string | null;
    isFree: boolean;
    price: string | null;
    size: string | null;
    version: string | null;
  };
}

export default function LibraryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) { router.push("/auth/signin"); return; }
    fetch("/api/user/library")
      .then((r) => r.json())
      .then((data) => { setLibrary(data); setLoading(false); });
  }, [session]);

  const handleUninstall = async (appId: number) => {
    if (!confirm("Remove from library?")) return;
    await fetch(`/api/apps/${appId}/install`, { method: "DELETE" });
    setLibrary((l) => l.filter((item) => item.app.id !== appId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#01875F]" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Library</h1>

      {library.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-700 mb-1">No apps installed yet</h2>
          <p className="text-sm text-gray-500 mb-4">Your installed apps will appear here</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#01875F] text-white rounded-full text-sm font-medium hover:bg-[#016d4d] transition-colors"
          >
            <Download className="h-4 w-4" /> Browse apps
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {library.map((item) => (
            <div
              key={item.installId}
              className="flex items-center gap-4 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
            >
              <Link href={`/app/${item.app.slug}`} className="flex items-center gap-4 flex-1 min-w-0">
                <img
                  src={item.app.icon}
                  alt={item.app.name}
                  className="w-14 h-14 rounded-2xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{item.app.name}</div>
                  <div className="text-xs text-gray-500 truncate">{item.app.developer}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    v{item.app.version} · {item.app.size} · Installed {formatDate(item.installedAt)}
                  </div>
                </div>
              </Link>
              <button
                onClick={() => handleUninstall(item.app.id)}
                className="p-2 rounded-full hover:bg-red-50 transition-colors shrink-0"
              >
                <Trash2 className="h-4 w-4 text-gray-300 hover:text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
