"use client";

import { Bell, Search, X, Settings, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/auth-actions";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [userEmail, setUserEmail] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserEmail(user.email || "");

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, business_name, subscription_plan")
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

  // Search
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
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const planBadge = profile?.subscription_plan && profile.subscription_plan !== "free"
    ? profile.subscription_plan.charAt(0).toUpperCase() + profile.subscription_plan.slice(1)
    : null;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-100">
      <div className="flex items-center justify-between px-4 py-3 lg:px-8">
        {/* Spacer for mobile hamburger */}
        <div className="lg:hidden w-10" />

        {/* Desktop Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md" ref={searchRef}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              placeholder="Search proposals, clients..."
              className="w-full pl-10 pr-8 py-2 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setSearchResults([]); setShowResults(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden z-50">
                {searchResults.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-slate-400">
                    {searching ? "Searching..." : "No results found"}
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto py-1">
                    {searchResults.map((result) => (
                      <Link
                        key={`${result.type}-${result.id}`}
                        href={result.href}
                        onClick={() => { setShowResults(false); setSearchQuery(""); }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                      >
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                          result.type === "proposal" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                        }`}>
                          {result.type === "proposal" ? "P" : "C"}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 truncate">{result.title}</p>
                          {result.subtitle && (
                            <p className="text-xs text-slate-400 truncate">{result.subtitle}</p>
                          )}
                        </div>
                        {result.status && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 capitalize font-medium">
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

        {/* Mobile Search Button */}
        <button
          onClick={() => setShowMobileSearch(true)}
          className="md:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Link
            href="/dashboard/notifications"
            className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 shadow-sm">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1.5 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-900 leading-tight">{profile?.full_name || "User"}</p>
                {planBadge && (
                  <p className="text-[10px] font-bold text-emerald-600">{planBadge} Plan</p>
                )}
              </div>
              <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-300" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-50">
                  <p className="text-sm font-medium text-slate-900">{profile?.full_name || "User"}</p>
                  <p className="text-xs text-slate-400 truncate">{userEmail}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Settings
                  </Link>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="flex items-center gap-3 px-4 py-2.5 w-full text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="md:hidden fixed inset-0 z-50 bg-white p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search proposals, clients..."
                autoFocus
                className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              onClick={() => { setShowMobileSearch(false); setSearchQuery(""); setSearchResults([]); }}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {searchResults.length > 0 && (
            <div className="space-y-1">
              {searchResults.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.href}
                  onClick={() => { setShowMobileSearch(false); setSearchQuery(""); }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                    result.type === "proposal" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                  }`}>
                    {result.type === "proposal" ? "P" : "C"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{result.title}</p>
                    {result.subtitle && <p className="text-xs text-slate-400">{result.subtitle}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
