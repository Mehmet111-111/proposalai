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
} from "lucide-react";
import Link from "next/link";

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

  const [form, setForm] = useState({
    projectType: "",
    projectDescription: "",
    clientName: "",
    clientCompany: "",
    clientEmail: "",
    currency: "USD",
    language: "English",
  });

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

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate proposal");
      }

      setProposal(data.proposal);
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Proposal</h1>
          <p className="text-slate-500 mt-1">
            AI will generate a professional proposal in seconds
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        {[
          { num: 1, label: "Project Details" },
          { num: 2, label: "Client Info" },
          { num: 3, label: "Preview & Send" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s.num
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
            </div>
            <span
              className={`text-sm font-medium ${
                step >= s.num ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {s.label}
            </span>
            {s.num < 3 && <div className="w-12 h-0.5 bg-slate-200 mx-2" />}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Step 1: Project Details */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Tell us about your project
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Project Type *
              </label>
              <select
                value={form.projectType}
                onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
              >
                <option value="">Select project type...</option>
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Project Description *
              </label>
              <textarea
                value={form.projectDescription}
                onChange={(e) =>
                  setForm({ ...form, projectDescription: e.target.value })
                }
                rows={5}
                placeholder="Describe the project in detail. For example: 'Build a modern portfolio website for a photographer. 5 pages: Home, Portfolio Gallery, About, Services, Contact. Mobile responsive, with image optimization and contact form integration.'"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-400 mt-1">
                The more detail you provide, the better the AI proposal will be
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Currency
                </label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.symbol} {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Proposal Language
                </label>
                <select
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
                >
                  <option value="English">English</option>
                  <option value="Turkish">Turkish</option>
                  <option value="Spanish">Spanish</option>
                  <option value="German">German</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (!form.projectType || !form.projectDescription) {
                    setError("Please fill in project type and description");
                    return;
                  }
                  setError("");
                  setStep(2);
                }}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
              >
                Next: Client Info →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Client Info */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Client Information
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Client Name
              </label>
              <input
                type="text"
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                placeholder="John Smith"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={form.clientCompany}
                onChange={(e) =>
                  setForm({ ...form, clientCompany: e.target.value })
                }
                placeholder="Acme Corp"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Client Email
              </label>
              <input
                type="email"
                value={form.clientEmail}
                onChange={(e) =>
                  setForm({ ...form, clientEmail: e.target.value })
                }
                placeholder="john@acme.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AI is writing your proposal...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Proposal with AI
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 3 && proposal && (
        <div className="space-y-6">
          {/* Success Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <p className="text-sm text-emerald-800 font-medium">
              AI generated your proposal! Review and edit below, then send to your
              client.
            </p>
          </div>

          {/* Proposal Preview */}
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {proposal.title}
            </h2>
            <p className="text-slate-600 mb-8">{proposal.summary}</p>

            {/* Scope */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Scope of Work
              </h3>
              <div className="space-y-3">
                {proposal.scope?.map((item: any, i: number) => (
                  <div key={i} className="pl-4 border-l-2 border-emerald-200">
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                Timeline
              </h3>
              <div className="space-y-3">
                {proposal.timeline?.map((phase: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-sm font-bold text-emerald-700 flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{phase.phase}</p>
                      <p className="text-xs text-slate-500 mb-1">
                        Duration: {phase.duration}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {phase.deliverables?.map((d: string, j: number) => (
                          <span
                            key={j}
                            className="text-xs px-2 py-1 bg-white border border-slate-200 rounded text-slate-600"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Packages */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Pricing Packages
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {proposal.packages?.map((pkg: any, i: number) => (
                  <div
                    key={i}
                    className={`rounded-xl border-2 p-6 ${
                      i === 1
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    {i === 1 && (
                      <span className="text-xs font-bold text-emerald-600 uppercase mb-2 block">
                        Recommended
                      </span>
                    )}
                    <h4 className="font-bold text-slate-900">{pkg.name}</h4>
                    <p className="text-3xl font-bold text-slate-900 my-3">
                      {currencies.find((c) => c.code === form.currency)?.symbol || "$"}
                      {pkg.price?.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500 mb-4">{pkg.description}</p>
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

            {/* Terms */}
            {proposal.terms && (
              <div className="mb-8 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Terms & Conditions
                </h3>
                <p className="text-sm text-slate-600">{proposal.terms}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => {
                setStep(1);
                setProposal(null);
              }}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              ← Start Over
            </button>
            <div className="flex gap-3">
              <button className="px-6 py-3 border border-emerald-600 text-emerald-700 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
                Save as Draft
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
                <Zap className="w-4 h-4" />
                Send to Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-xl max-w-sm">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-emerald-600 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              AI is crafting your proposal...
            </h3>
            <p className="text-sm text-slate-500">
              This usually takes 10-20 seconds. We&apos;re creating scope, timeline,
              and pricing packages tailored to your project.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
