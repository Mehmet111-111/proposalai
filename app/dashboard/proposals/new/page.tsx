"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  Loader2,
  ArrowLeft,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  Sparkles,
  Pencil,
  X,
  Save,
  Plus,
  Trash2,
  Link2,
  Copy,
  Check,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";
import Link from "next/link";
import { getCurrencySymbol } from "@/lib/currency";

const projectTypes = [
  "Web Design & Development",
  "Mobile App Development",
  "Logo & Branding",
  "UI/UX Design",
  "SEO & Digital Marketing",
  "Content Writing & Copywriting",
  "Video Production",
  "Social Media Management",
  "E-commerce Development",
  "Consulting",
  "Photography",
  "Other",
];

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
];

export default function NewProposalPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [proposal, setProposal] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    projectType: "",
    projectDescription: "",
    clientName: "",
    clientCompany: "",
    clientEmail: "",
    currency: "USD",
    language: "English",
  });

  const handleSave = async (sendStatus: "draft" | "sent") => {
    setSaving(true);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: proposal.title,
          content: proposal,
          clientName: form.clientName,
          clientCompany: form.clientCompany,
          clientEmail: form.clientEmail,
          currency: form.currency,
          language: form.language,
          status: sendStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      if (sendStatus === "sent" && data.proposal?.slug) {
        // Show share modal
        setShareUrl(`${window.location.origin}/p/${data.proposal.slug}`);
        setShowShareModal(true);
      } else {
        router.push("/dashboard/proposals");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!form.projectType || !form.projectDescription) {
      setError("Please fill in project type and description");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate proposal");
      setProposal(data.proposal);
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit helpers
  const updateProposal = (path: string, value: any) => {
    setProposal((prev: any) => {
      const updated = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const removeItem = (arrayPath: string, index: number) => {
    setProposal((prev: any) => {
      const updated = JSON.parse(JSON.stringify(prev));
      const keys = arrayPath.split(".");
      let obj = updated;
      for (const key of keys) obj = obj[key];
      obj.splice(index, 1);
      return updated;
    });
  };

  const addScopeItem = () => {
    setProposal((prev: any) => ({
      ...prev,
      scope: [...(prev.scope || []), { title: "New Item", description: "Description..." }],
    }));
  };

  const addTimelinePhase = () => {
    setProposal((prev: any) => ({
      ...prev,
      timeline: [...(prev.timeline || []), { phase: "New Phase", duration: "1 week", deliverables: ["Deliverable"] }],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Proposal</h1>
          <p className="text-slate-500 mt-1">AI will generate a professional proposal in seconds</p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-8">
        {[{ num: 1, label: "Project Details" }, { num: 2, label: "Client Info" }, { num: 3, label: "Preview & Send" }].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s.num ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"}`}>
              {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${step >= s.num ? "text-slate-900" : "text-slate-400"}`}>{s.label}</span>
            {s.num < 3 && <div className="w-8 sm:w-12 h-0.5 bg-slate-200 mx-1 sm:mx-2" />}
          </div>
        ))}
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      {/* STEP 1 */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Tell us about your project</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Project Type *</label>
              <select value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900">
                <option value="">Select project type...</option>
                {projectTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Project Description *</label>
              <textarea value={form.projectDescription} onChange={(e) => setForm({ ...form, projectDescription: e.target.value })} rows={5} placeholder="Describe the project in detail..." className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900">
                  {currencies.map((c) => (<option key={c.code} value={c.code}>{c.symbol} {c.code} - {c.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900">
                  <option value="English">English</option>
                  <option value="Turkish">Turkish</option>
                  <option value="Spanish">Spanish</option>
                  <option value="German">German</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => { if (!form.projectType || !form.projectDescription) { setError("Please fill in project type and description"); return; } setError(""); setStep(2); }} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">Next: Client Info →</button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Client Information</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Client Name</label>
              <input type="text" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="John Smith" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
              <input type="text" value={form.clientCompany} onChange={(e) => setForm({ ...form, clientCompany: e.target.value })} placeholder="Acme Corp" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Client Email</label>
              <input type="email" value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} placeholder="john@acme.com" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900" />
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50">← Back</button>
              <button onClick={handleGenerate} disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium disabled:opacity-50">
                {loading ? (<><Loader2 className="w-4 h-4 animate-spin" />AI is writing...</>) : (<><Sparkles className="w-4 h-4" />Generate Proposal with AI</>)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 - PREVIEW & EDIT */}
      {step === 3 && proposal && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <p className="text-sm text-emerald-800 font-medium">AI generated your proposal! Click any section to edit.</p>
            </div>
            <button
              onClick={() => setEditing(editing ? null : "all")}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <Pencil className="w-3 h-3" />
              {editing ? "Done Editing" : "Edit Mode"}
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
            {/* Title & Summary */}
            <div className="mb-8">
              {editing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={proposal.title}
                    onChange={(e) => updateProposal("title", e.target.value)}
                    className="w-full text-2xl font-bold text-slate-900 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                  />
                  <textarea
                    value={proposal.summary}
                    onChange={(e) => updateProposal("summary", e.target.value)}
                    rows={3}
                    className="w-full text-slate-600 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ) : (
                <div onClick={() => setEditing("all")} className="cursor-pointer hover:bg-slate-50 rounded-lg p-2 -m-2 transition-colors group">
                  <h2 className="text-2xl font-bold text-slate-900">{proposal.title} <Pencil className="w-4 h-4 inline text-slate-300 group-hover:text-emerald-500" /></h2>
                  <p className="text-slate-600 mt-2">{proposal.summary}</p>
                </div>
              )}
            </div>

            {/* Scope */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  Scope of Work
                </h3>
                {editing && (
                  <button onClick={addScopeItem} className="flex items-center gap-1 text-xs px-2 py-1 text-emerald-600 hover:bg-emerald-50 rounded">
                    <Plus className="w-3 h-3" /> Add Item
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {proposal.scope?.map((item: any, i: number) => (
                  <div key={i} className="pl-4 border-l-2 border-emerald-200">
                    {editing ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateProposal(`scope.${i}.title`, e.target.value)}
                            className="flex-1 font-medium text-slate-900 border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                          />
                          <button onClick={() => removeItem("scope", i)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                        <textarea
                          value={item.description}
                          onChange={(e) => updateProposal(`scope.${i}.description`, e.target.value)}
                          rows={2}
                          className="w-full text-sm text-slate-600 border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    ) : (
                      <>
                        <p className="font-medium text-slate-900">{item.title}</p>
                        <p className="text-sm text-slate-600">{item.description}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            {proposal.timeline && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    Timeline
                  </h3>
                  {editing && (
                    <button onClick={addTimelinePhase} className="flex items-center gap-1 text-xs px-2 py-1 text-emerald-600 hover:bg-emerald-50 rounded">
                      <Plus className="w-3 h-3" /> Add Phase
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {proposal.timeline.map((phase: any, i: number) => (
                    <div key={i} className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-sm font-bold text-emerald-700 flex-shrink-0">
                        {i + 1}
                      </div>
                      {editing ? (
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={phase.phase}
                              onChange={(e) => updateProposal(`timeline.${i}.phase`, e.target.value)}
                              className="flex-1 font-medium text-slate-900 border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                            />
                            <input
                              type="text"
                              value={phase.duration}
                              onChange={(e) => updateProposal(`timeline.${i}.duration`, e.target.value)}
                              className="w-28 text-sm border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                              placeholder="Duration"
                            />
                            <button onClick={() => removeItem("timeline", i)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ) : (
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
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Packages */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Pricing Packages
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {proposal.packages?.map((pkg: any, i: number) => (
                  <div key={i} className={`rounded-xl border-2 p-6 ${i === 1 ? "border-emerald-500 bg-emerald-50" : "border-slate-200"}`}>
                    {i === 1 && <span className="text-xs font-bold text-emerald-600 uppercase mb-2 block">Recommended</span>}
                    {editing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={pkg.name}
                          onChange={(e) => updateProposal(`packages.${i}.name`, e.target.value)}
                          className="w-full font-bold text-slate-900 border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                          type="number"
                          value={pkg.price}
                          onChange={(e) => updateProposal(`packages.${i}.price`, Number(e.target.value))}
                          className="w-full text-2xl font-bold border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                        />
                        {pkg.features?.map((f: string, j: number) => (
                          <div key={j} className="flex items-center gap-1">
                            <input
                              type="text"
                              value={f}
                              onChange={(e) => {
                                const features = [...pkg.features];
                                features[j] = e.target.value;
                                updateProposal(`packages.${i}.features`, features);
                              }}
                              className="flex-1 text-sm border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                            />
                            <button onClick={() => {
                              const features = pkg.features.filter((_: any, k: number) => k !== j);
                              updateProposal(`packages.${i}.features`, features);
                            }} className="text-red-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        ))}
                        <button onClick={() => {
                          const features = [...(pkg.features || []), "New feature"];
                          updateProposal(`packages.${i}.features`, features);
                        }} className="text-xs text-emerald-600 hover:text-emerald-700">+ Add feature</button>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-bold text-slate-900">{pkg.name}</h4>
                        <p className="text-3xl font-bold text-slate-900 my-3">{getCurrencySymbol(form.currency)}{pkg.price?.toLocaleString()}</p>
                        <ul className="space-y-2">
                          {pkg.features?.map((f: string, j: number) => (
                            <li key={j} className="flex items-start gap-2 text-sm"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" /><span>{f}</span></li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Terms */}
            {proposal.terms && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">Terms & Conditions</h3>
                {editing ? (
                  <textarea
                    value={proposal.terms}
                    onChange={(e) => updateProposal("terms", e.target.value)}
                    rows={3}
                    className="w-full text-sm text-slate-600 border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                  />
                ) : (
                  <p className="text-sm text-slate-600">{proposal.terms}</p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <button onClick={() => { setStep(1); setProposal(null); setEditing(null); }} className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50">← Start Over</button>
            <div className="flex gap-3">
              <button onClick={() => handleSave("draft")} disabled={saving} className="px-6 py-3 border border-emerald-600 text-emerald-700 rounded-lg font-medium hover:bg-emerald-50 disabled:opacity-50">{saving ? "Saving..." : "Save as Draft"}</button>
              <button onClick={() => handleSave("sent")} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium disabled:opacity-50"><Zap className="w-4 h-4" />{saving ? "Sending..." : "Send to Client"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && shareUrl && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => { setShowShareModal(false); router.push("/dashboard/proposals"); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Send className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Proposal Ready!</h3>
              <p className="text-sm text-slate-500 mt-1">Share the link below with your client</p>
            </div>

            {/* Copy Link */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1.5">Proposal Link</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg min-w-0 overflow-hidden">
                  <Link2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-700 truncate font-mono block overflow-hidden text-ellipsis whitespace-nowrap">{shareUrl}</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex-shrink-0 ${
                    copied
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
                </button>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Hi! Here's your proposal: ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-slate-700">Share via WhatsApp</span>
              </a>
              <a
                href={`mailto:${form.clientEmail || ""}?subject=${encodeURIComponent(`Proposal: ${proposal?.title || "Project Proposal"}`)}&body=${encodeURIComponent(`Hi${form.clientName ? " " + form.clientName : ""},\n\nPlease review the proposal here:\n${shareUrl}\n\nBest regards`)}`}
                className="flex items-center gap-3 w-full px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">Share via Email App</span>
              </a>
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Link2 className="w-5 h-5 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Preview Proposal</span>
              </a>
            </div>

            <button
              onClick={() => { setShowShareModal(false); router.push("/dashboard/proposals"); }}
              className="w-full mt-4 py-2.5 text-sm text-slate-500 hover:text-slate-700 font-medium"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-xl max-w-sm">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-emerald-600 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">AI is crafting your proposal...</h3>
            <p className="text-sm text-slate-500">This usually takes 10-20 seconds.</p>
          </div>
        </div>
      )}
    </div>
  );
}
