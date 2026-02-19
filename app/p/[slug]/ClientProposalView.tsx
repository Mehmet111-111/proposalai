"use client";

import { useState } from "react";
import { FileText, DollarSign, Clock, CheckCircle, Zap, User, XCircle, PartyPopper, Briefcase } from "lucide-react";
import { formatPrice } from "@/lib/currency";

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
  const currency = proposal.currency || "USD";
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

  const isExpired = proposal.valid_until && new Date(proposal.valid_until) < new Date();
  const brandColor = profile?.brand_color || "#10b981";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Print styles */}
      <style>{`@media print { .no-print { display: none !important; } body { background: white; } }`}</style>

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: brandColor }}>
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block leading-tight">
                {profile?.business_name || "ProposalAI"}
              </span>
              {profile?.full_name && (
                <span className="text-xs text-slate-400">{profile.full_name}</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Proposal for</span>
            <span className="text-sm font-medium text-slate-700">
              {proposal.clients?.name || "Client"}
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Expired banner */}
        {isExpired && !response && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <p className="text-sm font-medium text-amber-800">This proposal expired on {validDate}. Please contact the freelancer for an updated offer.</p>
          </div>
        )}

        {/* Response banners */}
        {response === "accepted" && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PartyPopper className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-800">Proposal Accepted!</h2>
            <p className="text-emerald-600 mt-2">Thank you for your trust. An invoice will be sent shortly.</p>
          </div>
        )}
        {response === "rejected" && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-red-800">Proposal Declined</h2>
            <p className="text-red-500 mt-2">The freelancer has been notified of your decision.</p>
          </div>
        )}

        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">{content?.title}</h1>
          <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-6">{content?.summary}</p>
          <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-slate-400 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>By {profile?.full_name || "Freelancer"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Valid until {validDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>{currency}</span>
            </div>
          </div>
        </div>

        {/* Scope */}
        {content?.scope && content.scope.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: brandColor + "15" }}>
                <FileText className="w-4 h-4" style={{ color: brandColor }} />
              </div>
              Scope of Work
            </h2>
            <div className="space-y-4">
              {content.scope.map((item: any, i: number) => (
                <div key={i} className="pl-5 border-l-2 py-1" style={{ borderColor: brandColor + "40" }}>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {content?.timeline && content.timeline.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: brandColor + "15" }}>
                <Clock className="w-4 h-4" style={{ color: brandColor }} />
              </div>
              Project Timeline
            </h2>
            <div className="space-y-4">
              {content.timeline.map((phase: any, i: number) => (
                <div key={i} className="flex gap-4 p-5 bg-slate-50 rounded-xl">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: brandColor }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{phase.phase}</p>
                    <p className="text-sm text-slate-400 mb-2">Duration: {phase.duration}</p>
                    {phase.deliverables && (
                      <div className="flex flex-wrap gap-2">
                        {phase.deliverables.map((d: string, j: number) => (
                          <span key={j} className="text-xs px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-600">{d}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Packages */}
        {content?.packages && content.packages.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: brandColor + "15" }}>
                <DollarSign className="w-4 h-4" style={{ color: brandColor }} />
              </div>
              Choose Your Package
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {content.packages.map((pkg: any, i: number) => {
                const isSelected = selectedPackage === pkg.name;
                return (
                  <div
                    key={i}
                    onClick={() => !response && !isExpired && setSelectedPackage(pkg.name)}
                    className={`rounded-2xl border-2 p-6 transition-all duration-200 ${
                      isSelected
                        ? "shadow-lg ring-1"
                        : "border-slate-100 hover:border-slate-200"
                    } ${response || isExpired ? "pointer-events-none" : "cursor-pointer"}`}
                    style={isSelected ? {
                      borderColor: brandColor,
                      backgroundColor: brandColor + "08",
                      // @ts-ignore
                      "--tw-ring-color": brandColor + "30",
                    } : {}}
                  >
                    {i === 1 && !isSelected && (
                      <span className="text-xs font-bold uppercase mb-3 block" style={{ color: brandColor }}>Recommended</span>
                    )}
                    {isSelected && !response && (
                      <span className="text-xs font-bold uppercase mb-3 block" style={{ color: brandColor }}>✓ Selected</span>
                    )}
                    <h3 className="text-lg font-bold text-slate-900">{pkg.name}</h3>
                    <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 my-4">
                      {formatPrice(pkg.price || 0, currency)}
                    </p>
                    {pkg.description && <p className="text-sm text-slate-400 mb-5">{pkg.description}</p>}
                    <ul className="space-y-3">
                      {pkg.features?.map((f: string, j: number) => (
                        <li key={j} className="flex items-start gap-2.5 text-sm">
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: brandColor }} />
                          <span className="text-slate-600">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Terms */}
        {content?.terms && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Terms & Conditions</h2>
            <p className="text-sm text-slate-500 leading-relaxed">{content.terms}</p>
          </div>
        )}

        {/* Action Buttons */}
        {!response && !isExpired && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 no-print">
            {!showConfirm ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setShowConfirm("accept")}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 text-white rounded-xl font-semibold text-lg transition-all hover:shadow-xl"
                  style={{ backgroundColor: brandColor }}
                >
                  <CheckCircle className="w-5 h-5" />
                  Accept Proposal
                </button>
                <button
                  onClick={() => setShowConfirm("reject")}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 border-2 border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl font-semibold text-lg transition-colors"
                >
                  Decline
                </button>
              </div>
            ) : showConfirm === "accept" ? (
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Acceptance</h3>
                <p className="text-slate-500 mb-1">
                  You are accepting the <strong className="text-slate-900">{selectedPackage}</strong> package
                </p>
                <p className="text-3xl font-bold mb-6" style={{ color: brandColor }}>
                  {formatPrice(content?.packages?.find((p: any) => p.name === selectedPackage)?.price || 0, currency)}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => setShowConfirm(null)} className="px-6 py-3 border border-slate-200 text-slate-500 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRespond("accept")}
                    disabled={responding}
                    className="px-6 py-3 text-white rounded-xl font-medium disabled:opacity-50 transition-all hover:shadow-lg"
                    style={{ backgroundColor: brandColor }}
                  >
                    {responding ? "Processing..." : "Confirm & Accept"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Decline Proposal?</h3>
                <p className="text-slate-500 mb-6">Are you sure you want to decline this proposal?</p>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => setShowConfirm(null)} className="px-6 py-3 border border-slate-200 text-slate-500 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRespond("reject")}
                    disabled={responding}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium disabled:opacity-50 transition-colors"
                  >
                    {responding ? "Processing..." : "Decline Proposal"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8 no-print">
          <p className="text-xs text-slate-300">
            Powered by <span className="font-medium text-emerald-500">ProposalAI</span>
          </p>
        </div>
      </div>
    </div>
  );
}
