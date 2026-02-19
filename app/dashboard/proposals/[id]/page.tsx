import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import {
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import DeleteProposalButton from "./DeleteButton";
import ShareLinkButton from "@/components/proposals/ShareLinkButton";

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: proposal } = await supabase
    .from("proposals")
    .select("*, clients(name, company, email)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!proposal) notFound();

  const content = proposal.content as any;
  const statusColors: Record<string, string> = {
    draft: "bg-slate-100 text-slate-700",
    sent: "bg-blue-100 text-blue-700",
    viewed: "bg-amber-100 text-amber-700",
    accepted: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    expired: "bg-slate-100 text-slate-500",
  };

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/p/${proposal.slug}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/proposals" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{proposal.title}</h1>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[proposal.status] || statusColors.draft}`}>
                {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
              </span>
            </div>
            <p className="text-slate-500 mt-1 text-sm">
              Created {new Date(proposal.created_at).toLocaleDateString("en-US")} • {proposal.currency}
            </p>
          </div>
        </div>
        <DeleteProposalButton proposalId={proposal.id} />
      </div>

      {/* Client Info & Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Client</p>
          <p className="text-sm font-medium text-slate-900">{proposal.clients?.name || "No client"}</p>
          <p className="text-xs text-slate-500">{proposal.clients?.company || ""}</p>
          {proposal.clients?.email && (
            <p className="text-xs text-slate-500 mt-1">{proposal.clients.email}</p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Total Amount</p>
          <p className="text-2xl font-bold text-slate-900">${proposal.total_amount?.toLocaleString() || "0"}</p>
          <p className="text-xs text-slate-500">Standard package</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Valid Until</p>
          <p className="text-sm font-medium text-slate-900">
            {proposal.valid_until ? new Date(proposal.valid_until).toLocaleDateString("en-US") : "No expiry"}
          </p>
          <p className="text-xs text-slate-500">
            {proposal.valid_until && new Date(proposal.valid_until) > new Date() ? "Active" : "Expired"}
          </p>
        </div>
      </div>

      {/* Public Link */}
      {proposal.slug && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <ExternalLink className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-emerald-800">Client View Link</p>
                <p className="text-xs text-emerald-600 font-mono truncate">{publicUrl}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href={`/p/${proposal.slug}`}
                target="_blank"
                className="text-xs px-3 py-1.5 bg-white border border-emerald-300 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100"
              >
                Preview
              </Link>
              <ShareLinkButton url={publicUrl} title={proposal.title} />
            </div>
          </div>
        </div>
      )}

      {/* Proposal Content */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">{content?.title}</h2>
        <p className="text-slate-600 mb-8">{content?.summary}</p>

        {content?.scope && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Scope of Work
            </h3>
            <div className="space-y-3">
              {content.scope.map((item: any, i: number) => (
                <div key={i} className="pl-4 border-l-2 border-emerald-200">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {content?.timeline && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              Timeline
            </h3>
            <div className="space-y-3">
              {content.timeline.map((phase: any, i: number) => (
                <div key={i} className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-sm font-bold text-emerald-700 flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{phase.phase}</p>
                    <p className="text-xs text-slate-500">Duration: {phase.duration}</p>
                    {phase.deliverables && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {phase.deliverables.map((d: string, j: number) => (
                          <span key={j} className="text-xs px-2 py-1 bg-white border border-slate-200 rounded text-slate-600">{d}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {content?.packages && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Pricing Packages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {content.packages.map((pkg: any, i: number) => (
                <div key={i} className={`rounded-xl border-2 p-6 ${i === 1 ? "border-emerald-500 bg-emerald-50" : "border-slate-200"}`}>
                  {i === 1 && <span className="text-xs font-bold text-emerald-600 uppercase mb-2 block">Recommended</span>}
                  <h4 className="font-bold text-slate-900">{pkg.name}</h4>
                  <p className="text-3xl font-bold text-slate-900 my-3">${pkg.price?.toLocaleString()}</p>
                  {pkg.description && <p className="text-sm text-slate-500 mb-4">{pkg.description}</p>}
                  <ul className="space-y-2">
                    {pkg.features?.map((f: string, j: number) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {content?.terms && (
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-2">Terms & Conditions</h3>
            <p className="text-sm text-slate-600">{content.terms}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Link href="/dashboard/proposals" className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium">
          ← Back to Proposals
        </Link>
        {proposal.status !== "accepted" && (
          <Link
            href={`/dashboard/proposals/${proposal.id}/edit`}
            className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
          >
            Edit Proposal
          </Link>
        )}
      </div>
    </div>
  );
}
