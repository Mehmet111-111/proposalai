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
    // Update local data
    proposals?.forEach((p) => {
      if (expiredIds.includes(p.id)) p.status = "expired";
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Proposals</h1>
          <p className="text-slate-500 mt-1">Manage all your proposals in one place</p>
        </div>
        <Link
          href="/dashboard/proposals/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Proposal
        </Link>
      </div>

      {proposals && proposals.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Proposal</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Client</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {proposals.map((proposal: any) => {
                  const status = statusConfig[proposal.status] || statusConfig.draft;
                  const StatusIcon = status.icon;
                  return (
                    <tr key={proposal.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">{proposal.title}</p>
                        <p className="text-xs text-slate-500">{proposal.currency}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-900">{proposal.clients?.name || "—"}</p>
                        <p className="text-xs text-slate-500">{proposal.clients?.company || ""}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-900">
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
                        <p className="text-sm text-slate-500">
                          {new Date(proposal.created_at).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/proposals/${proposal.id}`}
                            className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                          >
                            View
                          </Link>
                          {proposal.status !== "accepted" && (
                            <Link
                              href={`/dashboard/proposals/${proposal.id}/edit`}
                              className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                            >
                              Edit
                            </Link>
                          )}
                          {proposal.status === "draft" && (
                            <Link
                              href={`/dashboard/proposals/${proposal.id}/edit`}
                              className="text-xs px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                            >
                              Send
                            </Link>
                          )}
                          <DuplicateProposalButton proposalId={proposal.id} />
                          {proposal.slug && proposal.status !== "draft" && (
                            <ShareLinkButton
                              slug={proposal.slug}
                              title={proposal.title}
                            />
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
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900">No proposals yet</h2>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            Create your first AI-powered proposal and start winning more clients.
          </p>
          <Link
            href="/dashboard/proposals/new"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Your First Proposal
          </Link>
        </div>
      )}
    </div>
  );
}
