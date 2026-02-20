import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Plus,
  Receipt,
  Send,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if needs onboarding
  const { data: checkProfile } = await supabase
    .from("profiles")
    .select("full_name, business_name")
    .eq("id", user.id)
    .single();

  if (checkProfile && !checkProfile.full_name && !checkProfile.business_name) {
    redirect("/dashboard/onboarding");
  }

  // Auto-expire proposals past valid_until date
  await supabase
    .from("proposals")
    .update({ status: "expired" })
    .eq("user_id", user.id)
    .in("status", ["sent", "viewed"])
    .lt("valid_until", new Date().toISOString());

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: proposals } = await supabase
    .from("proposals")
    .select("id, status, total_amount, currency, created_at")
    .eq("user_id", user.id);

  const { data: clients } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user.id);

  const totalProposals = proposals?.length || 0;
  const acceptedProposals = proposals?.filter((p) => p.status === "accepted").length || 0;
  const totalRevenue = proposals
    ?.filter((p) => p.status === "accepted")
    .reduce((sum, p) => sum + (p.total_amount || 0), 0) || 0;
  const totalClients = clients?.length || 0;

  // Count proposals this month (same logic as API)
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const proposalsThisMonth = proposals?.filter(
    (p) => new Date(p.created_at) >= startOfMonth
  ).length || 0;
  const plan = profile?.subscription_plan || "free";
  const maxProposals = plan === "free" ? 3 : plan === "starter" ? 20 : 999;

  const { data: recentProposals } = await supabase
    .from("proposals")
    .select("id, title, status, total_amount, currency, created_at, clients(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  const statusColors: Record<string, string> = {
    accepted: "bg-emerald-500",
    sent: "bg-blue-500",
    viewed: "bg-amber-500",
    draft: "bg-slate-300",
    rejected: "bg-red-400",
    expired: "bg-slate-200",
  };

  // Helper for currency
  const currencySymbols: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", TRY: "₺", CAD: "C$", AUD: "A$" };
  const getSymbol = (c: string) => currencySymbols[c] || "$";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-slate-400 mt-1">
            Here&apos;s your business overview.
          </p>
        </div>
        <Link
          href="/dashboard/proposals/new"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-emerald-200"
        >
          <Plus className="w-4 h-4" />
          New Proposal
        </Link>
      </div>

      {/* Free plan warning */}
      {profile?.subscription_plan === "free" && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-500" />
            <p className="text-sm text-amber-800">
              <strong>{proposalsThisMonth}/{maxProposals}</strong> free proposals used.
              {proposalsThisMonth >= maxProposals
                ? " Upgrade to create more!"
                : ` ${maxProposals - proposalsThisMonth} remaining this month.`}
            </p>
          </div>
          <Link href="/dashboard/settings" className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 whitespace-nowrap">
            Upgrade <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">{totalProposals}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total Proposals</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">{getSymbol(proposals?.[0]?.currency || 'USD')}{totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total Revenue</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">{totalClients}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total Clients</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">
            {totalProposals > 0 ? Math.round((acceptedProposals / totalProposals) * 100) : 0}%
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Acceptance Rate</p>
        </div>
      </div>

      {/* Quick Actions - mobile */}
      <div className="sm:hidden grid grid-cols-3 gap-3">
        <Link href="/dashboard/proposals/new" className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Plus className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-xs font-medium text-slate-600">Proposal</span>
        </Link>
        <Link href="/dashboard/invoices" className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Receipt className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-xs font-medium text-slate-600">Invoices</span>
        </Link>
        <Link href="/dashboard/clients" className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <span className="text-xs font-medium text-slate-600">Clients</span>
        </Link>
      </div>

      {/* Recent Proposals */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
          <h2 className="font-semibold text-slate-900">Recent Proposals</h2>
          {recentProposals && recentProposals.length > 0 && (
            <Link href="/dashboard/proposals" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        {recentProposals && recentProposals.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {recentProposals.map((proposal: any) => (
              <Link key={proposal.id} href={`/dashboard/proposals/${proposal.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColors[proposal.status] || "bg-slate-300"}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{proposal.title}</p>
                    <p className="text-xs text-slate-400">
                      {(proposal.clients as any)?.name && <span>{(proposal.clients as any).name} · </span>}
                      {new Date(proposal.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${
                    proposal.status === "accepted" ? "bg-emerald-50 text-emerald-700" :
                    proposal.status === "sent" ? "bg-blue-50 text-blue-700" :
                    proposal.status === "viewed" ? "bg-amber-50 text-amber-700" :
                    "bg-slate-50 text-slate-500"
                  }`}>
                    {proposal.status}
                  </span>
                  <p className="text-sm font-semibold text-slate-900 tabular-nums">
                    {getSymbol(proposal.currency)}{(proposal.total_amount || 0).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-200" />
            </div>
            <p className="text-slate-900 font-medium">No proposals yet</p>
            <p className="text-sm text-slate-400 mt-1">Create your first AI-powered proposal to get started</p>
            <Link href="/dashboard/proposals/new" className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-200">
              <Plus className="w-4 h-4" />
              Create Proposal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
