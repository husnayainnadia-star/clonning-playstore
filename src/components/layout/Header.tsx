"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, X, User, LogOut, Settings, Download } from "lucide-react";
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

const topTabs = [
  { label: "Games", href: "/category/games" },
  { label: "Apps", href: "/" },
  { label: "Kids", href: "/category/education" },
];

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
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
    <header className="sticky top-0 z-50 border-b border-[#e8eaed] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="app-shell flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-2 rounded-lg px-1 py-1 hover:bg-gray-50">
            <div className="flex h-9 w-9 items-center justify-center">
              <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
                <path fill="#EA4335" d="M8.7 4.6c-.4.5-.7 1.2-.7 2.1v26.6c0 .9.3 1.6.7 2.1l.1.1 14.9-14.9v-.3L8.8 4.5l-.1.1z"/>
                <path fill="#FBBC04" d="M28.6 25.3l-5-5v-.3l5-5 .1.1 5.9 3.4c1.7 1 1.7 2.5 0 3.5l-6 3.3z"/>
                <path fill="#4285F4" d="M28.7 25.2L23.6 20 8.7 34.9c.5.6 1.4.7 2.4.1l17.6-9.8z"/>
                <path fill="#34A853" d="M28.7 14.8L11.1 5C10.1 4.4 9.2 4.5 8.7 5.1L23.6 20l5.1-5.2z"/>
              </svg>
            </div>
            <span className="hidden text-[22px] font-medium tracking-[-0.02em] text-[#5f6368] md:block">Google Play</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {topTabs.map((tab) => {
              const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className={`relative px-3 py-5 text-sm font-medium transition-colors ${
                    active ? "text-[#01875f]" : "text-[#5f6368] hover:text-[#202124]"
                  }`}
                >
                  {tab.label}
                  {active && <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-[#01875f]" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="ml-auto w-full max-w-[560px] flex-1" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5f6368]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search for apps & games"
              className="h-11 w-full rounded-lg bg-[#f1f3f4] pl-12 pr-11 text-[15px] text-[#202124] placeholder:text-[#5f6368] transition-all focus:bg-white focus:outline-none focus:shadow-[0_1px_6px_rgba(32,33,36,.28)]"
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setSuggestions([]); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[#5f6368] hover:bg-gray-100"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {showSuggestions && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-2xl border border-[#e8eaed] bg-white shadow-[0_4px_16px_rgba(60,64,67,.15)]">
                {suggestions.length > 0 ? (
                  <>
                    <div className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-[#5f6368]">Suggestions</div>
                    {suggestions.map((s) => (
                      <button key={s.id} onClick={() => handleSearch(s.name)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#f8f9fa]">
                        <img src={s.icon} alt={s.name} className="h-9 w-9 rounded-xl bg-gray-100 object-cover" />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-[#202124]">{s.name}</div>
                          <div className="truncate text-xs text-[#5f6368]">{s.developer}</div>
                        </div>
                      </button>
                    ))}
                  </>
                ) : recentSearches.length > 0 && !query ? (
                  <>
                    <div className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-[#5f6368]">Recent searches</div>
                    {recentSearches.map((term) => (
                      <div key={term} className="flex items-center gap-2 px-4 hover:bg-[#f8f9fa]">
                        <button onClick={() => handleSearch(term)} className="flex flex-1 items-center gap-3 py-2.5 text-sm text-[#3c4043]">
                          <Search className="h-4 w-4 text-[#5f6368]" />
                          <span className="truncate">{term}</span>
                        </button>
                        <button onClick={() => removeRecent(term)} className="rounded-full p-1.5 text-[#5f6368] hover:bg-gray-200" aria-label={`Remove ${term}`}>
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </>
                ) : query.length >= 2 ? (
                  <button onClick={() => handleSearch()} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#3c4043] hover:bg-[#f8f9fa]">
                    <Search className="h-4 w-4 text-[#5f6368]" />
                    Search for &ldquo;{query}&rdquo;
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full p-0.5 ring-offset-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#01875f]/30">
                  <Avatar className="h-9 w-9 cursor-pointer">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback className="bg-[#01875F] text-white text-sm font-medium">
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 rounded-xl p-1.5">
                <DropdownMenuLabel className="px-3 py-2">
                  <div className="font-medium text-[#202124]">{session.user?.name}</div>
                  <div className="text-xs font-normal text-[#5f6368]">{session.user?.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer rounded-lg px-3 py-2">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/library" className="cursor-pointer rounded-lg px-3 py-2">
                    <Download className="mr-2 h-4 w-4" /> My Library
                  </Link>
                </DropdownMenuItem>
                {(session.user as any)?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer rounded-lg px-3 py-2">
                      <Settings className="mr-2 h-4 w-4" /> Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="cursor-pointer rounded-lg px-3 py-2 text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/signin">
              <Button className="h-9 rounded-lg px-5 text-sm font-medium">
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
