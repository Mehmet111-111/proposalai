"use client";

import { Bell, Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Fetch profile and unread notifications
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false);
      setUnreadCount(count || 0);
    };
    fetchData();
  }, []);

  // Search proposals and clients
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setSearching(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [proposalsRes, clientsRes] = await Promise.all([
        supabase
          .from("proposals")
          .select("id, title, status, clients(name)")
          .eq("user_id", user.id)
          .ilike("title", `%${searchQuery}%`)
          .limit(5),
        supabase
          .from("clients")
          .select("id, name, company")
          .eq("user_id", user.id)
          .or(`name.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%`)
          .limit(5),
      ]);

      const results: any[] = [];
      proposalsRes.data?.forEach((p) =>
        results.push({ type: "proposal", id: p.id, title: p.title, subtitle: (p.clients as any)?.name || "", status: p.status, href: `/dashboard/proposals/${p.id}` })
      );
      clientsRes.data?.forEach((c) =>
        results.push({ type: "client", id: c.id, title: c.name, subtitle: c.company || "", href: `/dashboard/clients` })
      );

      setSearchResults(results);
      setShowResults(true);
      setSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-4 py-3 lg:px-8">
        {/* Spacer for mobile */}
        <div className="lg:hidden w-10" />

        {/* Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md" ref={searchRef}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              placeholder="Search proposals, clients..."
              className="w-full pl-10 pr-8 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setSearchResults([]); setShowResults(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50">
                {searchResults.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-slate-500">
                    {searching ? "Searching..." : "No results found"}
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto">
                    {searchResults.map((result) => (
                      <Link
                        key={`${result.type}-${result.id}`}
                        href={result.href}
                        onClick={() => { setShowResults(false); setSearchQuery(""); }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                      >
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          result.type === "proposal" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                        }`}>
                          {result.type === "proposal" ? "P" : "C"}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 truncate">{result.title}</p>
                          {result.subtitle && (
                            <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                          )}
                        </div>
                        {result.status && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                            {result.status}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Link
            href="/dashboard/notifications"
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          {/* Avatar */}
          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
