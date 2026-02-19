import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FileText, Plus, Eye, Clock, CheckCircle, XCircle, Send } from "lucide-react";
import Link from "next/link";
import ShareLinkButton from "@/components/proposals/ShareLinkButton";
import DuplicateProposalButton from "@/components/proposals/DuplicateButton";
import { formatPrice } from "@/lib/currency";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  draft: { label: "Draft", color: "bg-slate-100 text-slate-700", icon: FileText },
  sent: { label: "Sent", color: "bg-blue-100 text-blue-700", icon: Send },
  viewed: { label: "Viewed", color: "bg-amber-100 text-amber-700", icon: Eye },
  accepted: { label: "Accepted", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
  expired: { label: "Expired", color: "bg-slate-100 text-slate-500", icon: Clock },
};

export default async function ProposalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: proposals } = await supabase
    .from("proposals")
    .select("*, clients(name, company)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Auto-expire proposals past valid_until
  const now = new Date();
  const expiredIds = (proposals || [])
    .filter((p) => p.valid_until && new Date(p.valid_until) < now && ["sent", "viewed"].includes(p.status))
    .map((p) => p.id);

  if (expiredIds.length > 0) {
    await supabase
      .from("proposals")
      .update({ status: "expired" })
      .in("id", expiredIds);
    proposals?.forEach((p) => {
      if (expiredIds.includes(p.id)) p.status = "expired";
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Proposals</h1>
          <p className="text-slate-500 mt-1">{proposals?.length || 0} total proposals</p>
        </div>
        <Link
          href="/dashboard/proposals/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-emerald-200"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Proposal</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>

      {proposals && proposals.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-2xl border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Proposal</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Client</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Amount</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {proposals.map((proposal: any) => {
                    const status = statusConfig[proposal.status] || statusConfig.draft;
                    const StatusIcon = status.icon;
                    return (
                      <tr key={proposal.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <Link href={`/dashboard/proposals/${proposal.id}`} className="hover:text-emerald-600 transition-colors">
                            <p className="text-sm font-medium text-slate-900">{proposal.title}</p>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-900">{proposal.clients?.name || "—"}</p>
                          <p className="text-xs text-slate-400">{proposal.clients?.company || ""}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-900 tabular-nums">
                            {formatPrice(proposal.total_amount || 0, proposal.currency)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-400">
                            {new Date(proposal.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/proposals/${proposal.id}`} className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
                              View
                            </Link>
                            {proposal.status !== "accepted" && (
                              <Link href={`/dashboard/proposals/${proposal.id}/edit`} className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
                                Edit
                              </Link>
                            )}
                            <DuplicateProposalButton proposalId={proposal.id} />
                            {proposal.slug && proposal.status !== "draft" && (
                              <ShareLinkButton slug={proposal.slug} title={proposal.title} />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {proposals.map((proposal: any) => {
              const status = statusConfig[proposal.status] || statusConfig.draft;
              const StatusIcon = status.icon;
              return (
                <div key={proposal.id} className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <Link href={`/dashboard/proposals/${proposal.id}`} className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">{proposal.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {proposal.clients?.name || "No client"}{proposal.clients?.company ? ` · ${proposal.clients.company}` : ""}
                      </p>
                    </Link>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-3 ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-lg font-bold text-slate-900 tabular-nums">
                      {formatPrice(proposal.total_amount || 0, proposal.currency)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(proposal.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-50 flex-wrap">
                    <Link href={`/dashboard/proposals/${proposal.id}`} className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
                      View
                    </Link>
                    {proposal.status !== "accepted" && (
                      <Link href={`/dashboard/proposals/${proposal.id}/edit`} className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
                        Edit
                      </Link>
                    )}
                    <DuplicateProposalButton proposalId={proposal.id} />
                    {proposal.slug && proposal.status !== "draft" && (
                      <ShareLinkButton slug={proposal.slug} title={proposal.title} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <FileText className="w-10 h-10 text-slate-200" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">No proposals yet</h2>
          <p className="text-slate-400 mt-2 max-w-sm mx-auto">
            Create your first AI-powered proposal and start winning more clients.
          </p>
          <Link
            href="/dashboard/proposals/new"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-200"
          >
            <Plus className="w-4 h-4" />
            Create Your First Proposal
          </Link>
        </div>
      )}
    </div>
  );
}
