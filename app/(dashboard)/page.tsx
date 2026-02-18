import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  FileText,
  Receipt,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get proposals count and stats
  const { data: proposals } = await supabase
    .from("proposals")
    .select("id, status, total_amount, created_at")
    .eq("user_id", user.id);

  // Get clients count
  const { data: clients } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user.id);

  // Get invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, status, total_amount")
    .eq("user_id", user.id);

  // Get recent notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .eq("read", false)
    .order("created_at", { ascending: false })
    .limit(5);

  // Calculate stats
  const totalProposals = proposals?.length || 0;
  const acceptedProposals = proposals?.filter((p) => p.status === "accepted").length || 0;
  const pendingProposals = proposals?.filter((p) => p.status === "sent").length || 0;
  const totalRevenue = proposals
    ?.filter((p) => p.status === "accepted")
    .reduce((sum, p) => sum + (p.total_amount || 0), 0) || 0;
  const totalClients = clients?.length || 0;
  const pendingInvoices = invoices?.filter((i) => i.status === "sent").length || 0;
  const proposalsThisMonth = profile?.proposals_this_month || 0;
  const maxFreeProposals = profile?.subscription_plan === "free" ? 3 : 999;

  // Get recent proposals
  const { data: recentProposals } = await supabase
    .from("proposals")
    .select("id, title, status, total_amount, created_at, clients(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Here&apos;s what&apos;s happening with your proposals today.
          </p>
        </div>
        <Link
          href="/dashboard/proposals/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Proposal
        </Link>
      </div>

      {/* Usage Alert for Free Plan */}
      {profile?.subscription_plan === "free" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-800">
              You&apos;ve used <strong>{proposalsThisMonth}/{maxFreeProposals}</strong> free proposals this month.
              {proposalsThisMonth >= maxFreeProposals
                ? " Upgrade to create more!"
                : ` ${maxFreeProposals - proposalsThisMonth} remaining.`}
            </p>
          </div>
          <Link
            href="/dashboard/settings"
            className="text-sm font-medium text-amber-700 hover:text-amber-900 flex items-center gap-1"
          >
            Upgrade <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-slate-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-4">{totalProposals}</p>
          <p className="text-sm text-slate-500 mt-1">Proposals</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600">Revenue</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-4">
            ${totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-slate-500 mt-1">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-slate-500">Clients</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-4">{totalClients}</p>
          <p className="text-sm text-slate-500 mt-1">Total Clients</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-slate-500">Win Rate</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-4">
            {totalProposals > 0 ? Math.round((acceptedProposals / totalProposals) * 100) : 0}%
          </p>
          <p className="text-sm text-slate-500 mt-1">Acceptance Rate</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Proposals */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Recent Proposals</h2>
            <Link
              href="/dashboard/proposals"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View All
            </Link>
          </div>

          {recentProposals && recentProposals.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentProposals.map((proposal: any) => (
                <div
                  key={proposal.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        proposal.status === "accepted"
                          ? "bg-emerald-500"
                          : proposal.status === "sent"
                          ? "bg-blue-500"
                          : proposal.status === "viewed"
                          ? "bg-amber-500"
                          : "bg-slate-300"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {proposal.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {proposal.clients?.name || "No client"} &middot;{" "}
                        {new Date(proposal.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      ${proposal.total_amount?.toLocaleString() || "0"}
                    </p>
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                        proposal.status === "accepted"
                          ? "bg-emerald-100 text-emerald-700"
                          : proposal.status === "sent"
                          ? "bg-blue-100 text-blue-700"
                          : proposal.status === "viewed"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {proposal.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No proposals yet</p>
              <p className="text-sm text-slate-400 mt-1">
                Create your first AI-powered proposal
              </p>
              <Link
                href="/dashboard/proposals/new"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Proposal
              </Link>
            </div>
          )}
        </div>

        {/* Quick Stats & Notifications */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-slate-600">Pending</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {pendingProposals}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-slate-600">Accepted</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {acceptedProposals}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-slate-600">Unpaid Invoices</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {pendingInvoices}
                </span>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Notifications</h2>
            {notifications && notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notif: any) => (
                  <div key={notif.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-700">{notif.title}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No new notifications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
