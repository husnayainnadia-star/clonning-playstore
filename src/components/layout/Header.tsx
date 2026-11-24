"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X, Bell, User, LogOut, Settings, Download } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SearchSuggestion {
  id: number;
  name: string;
  slug: string;
  icon: string;
  developer: string;
}

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) setRecentSearches(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        try {
          const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          setSuggestions(data);
          setShowSuggestions(true);
        } catch {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(query.length === 0);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async (q: string = query) => {
    if (!q.trim()) return;
    const recent = [q, ...recentSearches.filter((s) => s !== q)].slice(0, 5);
    setRecentSearches(recent);
    localStorage.setItem("recentSearches", JSON.stringify(recent));

    if (session?.user) {
      await fetch("/api/search/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
    }

    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const removeRecent = (term: string) => {
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-[#01875F] rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zM3 14h7v7H3z" />
            </svg>
          </div>
          <span className="font-semibold text-gray-800 hidden sm:block text-sm">Google Play</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 relative" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search apps & games"
              className="w-full h-10 pl-10 pr-4 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#01875F]/30 focus:border-[#01875F] focus:bg-white transition-all"
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setSuggestions([]); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-3.5 w-3.5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
              {suggestions.length > 0 ? (
                <>
                  <div className="px-4 py-2 text-xs font-medium text-gray-500">Suggestions</div>
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSearch(s.name)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <img src={s.icon} alt={s.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-800">{s.name}</div>
                        <div className="text-xs text-gray-500">{s.developer}</div>
                      </div>
                    </button>
                  ))}
                </>
              ) : recentSearches.length > 0 && !query ? (
                <>
                  <div className="px-4 py-2 text-xs font-medium text-gray-500">Recent searches</div>
                  {recentSearches.map((term) => (
                    <div key={term} className="flex items-center gap-2 px-4 hover:bg-gray-50">
                      <button
                        onClick={() => handleSearch(term)}
                        className="flex-1 flex items-center gap-2 py-2.5 text-sm text-gray-700"
                      >
                        <Search className="h-3.5 w-3.5 text-gray-400" />
                        {term}
                      </button>
                      <button
                        onClick={() => removeRecent(term)}
                        className="p-1 rounded-full hover:bg-gray-200"
                      >
                        <X className="h-3 w-3 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </>
              ) : query.length >= 2 ? (
                <button
                  onClick={() => handleSearch()}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700"
                >
                  <Search className="h-4 w-4 text-gray-400" />
                  Search for &ldquo;{query}&rdquo;
                </button>
              ) : null}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback className="bg-[#01875F] text-white text-xs">
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-medium">{session.user?.name}</div>
                  <div className="text-xs text-gray-500 font-normal">{session.user?.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/library" className="cursor-pointer">
                    <Download className="mr-2 h-4 w-4" /> My Library
                  </Link>
                </DropdownMenuItem>
                {(session.user as any)?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" /> Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="cursor-pointer text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/signin">
              <Button size="sm" variant="outline" className="text-xs px-4">
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
