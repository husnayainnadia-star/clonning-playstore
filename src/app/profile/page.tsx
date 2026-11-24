"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Edit2, LogOut, Loader2, CheckCircle2, Package } from "lucide-react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!session) { router.push("/auth/signin"); return; }
    setName(session.user?.name || "");
    setImageUrl(session.user?.image || "");
  }, [session]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image: imageUrl }),
      });
      if (res.ok) {
        await update({ name, image: imageUrl });
        setSaved(true);
        setEditMode(false);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!session) return null;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account</h1>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={imageUrl} />
              <AvatarFallback className="bg-[#01875F] text-white text-2xl">
                {name[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {editMode && (
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#01875F] rounded-full flex items-center justify-center">
                <Camera className="h-3.5 w-3.5 text-white" />
              </button>
            )}
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">{session.user?.name}</div>
            <div className="text-sm text-gray-500">{session.user?.email}</div>
            <div className="mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                (session.user as any)?.role === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {(session.user as any)?.role || "user"}
              </span>
            </div>
          </div>
        </div>

        {editMode ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Profile picture URL</Label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving} size="sm">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
                {saving ? "Saving..." : "Save changes"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
              <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Edit profile
            </Button>
            {saved && (
              <span className="flex items-center gap-1 text-sm text-[#01875F]">
                <CheckCircle2 className="h-4 w-4" /> Saved!
              </span>
            )}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
        <button
          onClick={() => router.push("/library")}
          className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50"
        >
          <Package className="h-5 w-5 text-gray-400" />
          <div>
            <div className="text-sm font-medium text-gray-900">My Library</div>
            <div className="text-xs text-gray-500">Installed apps & games</div>
          </div>
        </button>
        {(session.user as any)?.role === "admin" && (
          <button
            onClick={() => router.push("/admin")}
            className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="h-5 w-5 bg-purple-100 rounded flex items-center justify-center">
              <span className="text-purple-700 text-[10px] font-bold">A</span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Admin Dashboard</div>
              <div className="text-xs text-gray-500">Manage apps and users</div>
            </div>
          </button>
        )}
      </div>

      {/* Sign out */}
      <Button
        variant="outline"
        className="w-full text-red-600 border-red-200 hover:bg-red-50"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut className="h-4 w-4 mr-2" /> Sign out
      </Button>
    </div>
  );
}
