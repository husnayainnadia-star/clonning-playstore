"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, X } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface AppData {
  id?: number;
  name: string;
  developer: string;
  categoryId: number | null;
  icon: string;
  screenshots: string[] | null;
  description: string;
  whatsNew: string | null;
  version: string | null;
  size: string | null;
  minAndroid: string | null;
  isFree: boolean;
  price: string | null;
  contentRating: string | null;
  website: string | null;
  email: string | null;
  isFeatured: boolean;
  isEditor: boolean;
  isActive: boolean;
}

interface AppFormProps {
  categories: Category[];
  app?: AppData;
}

export default function AppForm({ categories, app }: AppFormProps) {
  const router = useRouter();
  const isEdit = !!app?.id;

  const [form, setForm] = useState({
    name: app?.name || "",
    developer: app?.developer || "",
    categoryId: app?.categoryId?.toString() || "",
    icon: app?.icon || "",
    description: app?.description || "",
    whatsNew: app?.whatsNew || "",
    version: app?.version || "1.0.0",
    size: app?.size || "10 MB",
    minAndroid: app?.minAndroid || "5.0 and up",
    isFree: app?.isFree !== false,
    price: app?.price || "0.99",
    contentRating: app?.contentRating || "Everyone",
    website: app?.website || "",
    email: app?.email || "",
    isFeatured: app?.isFeatured || false,
    isEditor: app?.isEditor || false,
    isActive: app?.isActive !== false,
  });

  const [screenshots, setScreenshots] = useState<string[]>(app?.screenshots || []);
  const [newScreenshot, setNewScreenshot] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addScreenshot = () => {
    if (newScreenshot.trim()) {
      setScreenshots((s) => [...s, newScreenshot.trim()]);
      setNewScreenshot("");
    }
  };

  const removeScreenshot = (i: number) => {
    setScreenshots((s) => s.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      categoryId: form.categoryId ? parseInt(form.categoryId) : null,
      screenshots,
      price: form.isFree ? "0" : form.price,
    };

    try {
      const url = isEdit ? `/api/apps/${app!.id}` : "/api/apps";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save app");
        return;
      }

      router.push("/admin/apps");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-semibold text-gray-900">Basic Information</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 col-span-2">
            <Label htmlFor="name">App Name *</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="space-y-1.5 col-span-2">
            <Label htmlFor="developer">Developer *</Label>
            <Input id="developer" name="developer" value={form.developer} onChange={handleChange} required />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#01875F]/30"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contentRating">Content Rating</Label>
            <select
              name="contentRating"
              value={form.contentRating}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#01875F]/30"
            >
              {["Everyone", "Everyone 10+", "Teen", "Mature 17+"].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description *</Label>
          <Textarea id="description" name="description" value={form.description} onChange={handleChange} rows={5} required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="whatsNew">What's New</Label>
          <Textarea id="whatsNew" name="whatsNew" value={form.whatsNew} onChange={handleChange} rows={3} />
        </div>
      </div>

      {/* Media */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-semibold text-gray-900">Media</h2>
        <div className="space-y-1.5">
          <Label htmlFor="icon">App Icon URL *</Label>
          <Input id="icon" name="icon" value={form.icon} onChange={handleChange} placeholder="https://..." required />
          {form.icon && (
            <img src={form.icon} alt="Preview" className="w-16 h-16 rounded-2xl object-cover mt-2" />
          )}
        </div>

        <div className="space-y-2">
          <Label>Screenshots</Label>
          <div className="flex gap-2">
            <Input
              value={newScreenshot}
              onChange={(e) => setNewScreenshot(e.target.value)}
              placeholder="Screenshot URL..."
              className="flex-1"
            />
            <Button type="button" variant="outline" size="sm" onClick={addScreenshot}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {screenshots.map((s, i) => (
              <div key={i} className="relative group">
                <img src={s} alt="" className="h-16 w-auto rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => removeScreenshot(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technical */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-semibold text-gray-900">Technical Details</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="version">Version</Label>
            <Input id="version" name="version" value={form.version} onChange={handleChange} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="size">Size</Label>
            <Input id="size" name="size" value={form.size} onChange={handleChange} placeholder="10 MB" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="minAndroid">Min Android</Label>
            <Input id="minAndroid" name="minAndroid" value={form.minAndroid} onChange={handleChange} />
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isFree"
              checked={form.isFree}
              onChange={handleChange}
              className="w-4 h-4 accent-[#01875F]"
            />
            <span className="text-sm">Free</span>
          </label>
          {!form.isFree && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">$</span>
              <Input name="price" value={form.price} onChange={handleChange} className="w-24" placeholder="0.99" />
            </div>
          )}
        </div>
      </div>

      {/* Flags */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Visibility</h2>
        <div className="flex flex-wrap gap-6">
          {[
            { name: "isActive", label: "Active (visible)" },
            { name: "isFeatured", label: "Featured" },
            { name: "isEditor", label: "Editor's Choice" },
          ].map(({ name, label }) => (
            <label key={name} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name={name}
                checked={(form as any)[name]}
                onChange={handleChange}
                className="w-4 h-4 accent-[#01875F]"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-semibold text-gray-900">Links</h2>
        <div className="space-y-1.5">
          <Label htmlFor="website">Website</Label>
          <Input id="website" name="website" value={form.website} onChange={handleChange} placeholder="https://..." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Support Email</Label>
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {saving ? "Saving..." : isEdit ? "Save changes" : "Create app"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/apps")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
