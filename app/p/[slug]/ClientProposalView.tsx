"use client";

import { useState } from "react";
import { FileText, DollarSign, Clock, CheckCircle, Zap, User, XCircle, PartyPopper } from "lucide-react";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US").format(price);
}

export default function ClientProposalView({
  proposal,
  profile,
  shouldMarkViewed,
}: {
  proposal: any;
  profile: any;
  shouldMarkViewed?: boolean;
}) {
  const content = proposal.content as any;
  const [selectedPackage, setSelectedPackage] = useState("Standard");
  const [responding, setResponding] = useState(false);
  const [response, setResponse] = useState<"accepted" | "rejected" | null>(
    proposal.status === "accepted" ? "accepted" : proposal.status === "rejected" ? "rejected" : null
  );
  const [showConfirm, setShowConfirm] = useState<"accept" | "reject" | null>(null);

  // Mark as viewed on load
  const [viewMarked, setViewMarked] = useState(false);
  if (shouldMarkViewed && !viewMarked) {
    setViewMarked(true);
    fetch(`/api/proposals/${proposal.id}/view`, { method: "POST" }).catch(() => {});
  }

  const handleRespond = async (action: "accept" | "reject") => {
    setResponding(true);
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          selectedPackage,
          clientName: proposal.clients?.name,
        }),
      });
      if (res.ok) {
        setResponse(action === "accept" ? "accepted" : "rejected");
        setShowConfirm(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setResponding(false);
    }
  };

  const validDate = proposal.valid_until
    ? new Date(proposal.valid_until).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "N/A";

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              {profile?.business_name || "ProposalAI"}
            </span>
          </div>
          <span className="text-sm text-slate-500">
            Proposal for {proposal.clients?.name || "Client"}
          </span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {response === "accepted" && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-6 text-center">
            <PartyPopper className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-emerald-800">Proposal Accepted!</h2>
            <p className="text-emerald-600 mt-2">Thank you! An invoice will be sent shortly.</p>
          </div>
        )}
        {response === "rejected" && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-red-800">Proposal Declined</h2>
            <p className="text-red-600 mt-2">The freelancer has been notified.</p>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">{content?.title}</h1>
          <p className="text-lg text-slate-600 mb-6">{content?.summary}</p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>Prepared by: {profile?.full_name || "Freelancer"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Valid until: {validDate}</span>
            </div>
          </div>
        </div>

        {content?.scope && (
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Scope of Work
            </h2>
            <div className="space-y-4">
              {content.scope.map((item: any, i: number) => (
                <div key={i} className="pl-4 border-l-2 border-emerald-300">
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-slate-600 mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {content?.timeline && (
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              Project Timeline
            </h2>
            <div className="space-y-4">
              {content.timeline.map((phase: any, i: number) => (
                <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-sm font-bold text-emerald-700 flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{phase.phase}</p>
                    <p className="text-sm text-slate-500 mb-2">Duration: {phase.duration}</p>
                    {phase.deliverables && (
                      <div className="flex flex-wrap gap-2">
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
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Choose Your Package
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.packages.map((pkg: any, i: number) => {
                const isSelected = selectedPackage === pkg.name;
                return (
                  <div
                    key={i}
                    onClick={() => !response && setSelectedPackage(pkg.name)}
                    className={`rounded-xl border-2 p-6 transition-all ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50 shadow-lg ring-2 ring-emerald-200"
                        : "border-slate-200 hover:border-slate-300"
                    } ${response ? "pointer-events-none" : "cursor-pointer"}`}
                  >
                    {i === 1 && !isSelected && <span className="text-xs font-bold text-emerald-600 uppercase mb-2 block">Recommended</span>}
                    {isSelected && !response && <span className="text-xs font-bold text-emerald-600 uppercase mb-2 block">✓ Selected</span>}
                    <h3 className="text-lg font-bold text-slate-900">{pkg.name}</h3>
                    <p className="text-4xl font-bold text-slate-900 my-4">${formatPrice(pkg.price || 0)}</p>
                    {pkg.description && <p className="text-sm text-slate-500 mb-4">{pkg.description}</p>}
                    <ul className="space-y-3">
                      {pkg.features?.map((f: string, j: number) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {content?.terms && (
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Terms & Conditions</h2>
            <p className="text-sm text-slate-600">{content.terms}</p>
          </div>
        )}

        {!response && (
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            {!showConfirm ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setShowConfirm("accept")}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-lg transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Accept Proposal
                </button>
                <button
                  onClick={() => setShowConfirm("reject")}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-300 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold text-lg transition-colors"
                >
                  Decline
                </button>
              </div>
            ) : showConfirm === "accept" ? (
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Acceptance</h3>
                <p className="text-slate-600 mb-1">
                  You are accepting the <strong>{selectedPackage}</strong> package
                </p>
                <p className="text-2xl font-bold text-emerald-600 mb-6">
                  ${formatPrice(content?.packages?.find((p: any) => p.name === selectedPackage)?.price || 0)}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => setShowConfirm(null)} className="px-6 py-3 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50">Cancel</button>
                  <button onClick={() => handleRespond("accept")} disabled={responding} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium disabled:opacity-50">
                    {responding ? "Processing..." : "Confirm & Accept"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Decline Proposal?</h3>
                <p className="text-slate-600 mb-6">Are you sure you want to decline this proposal?</p>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => setShowConfirm(null)} className="px-6 py-3 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50">Cancel</button>
                  <button onClick={() => handleRespond("reject")} disabled={responding} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50">
                    {responding ? "Processing..." : "Decline Proposal"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-center py-6">
          <p className="text-xs text-slate-400">
            Powered by <span className="font-medium text-emerald-600">ProposalAI</span>
          </p>
        </div>
      </div>
    </div>
  );
}
