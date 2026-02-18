"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  Loader2,
  Save,
  Send,
  Plus,
  Trash2,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function EditProposalPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [proposal, setProposal] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchProposal();
  }, []);

  const fetchProposal = async () => {
    try {
      const res = await fetch(`/api/proposals`);
      const data = await res.json();
      const found = data.proposals?.find((p: any) => p.id === id);
      if (found) {
        setProposal(found);
        setContent(JSON.parse(JSON.stringify(found.content)));
        setStatus(found.status);
      }
    } catch (err) {
      setError("Failed to load proposal");
    } finally {
      setLoading(false);
    }
  };

  const updateContent = (path: string, value: any) => {
    setContent((prev: any) => {
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
    setContent((prev: any) => {
      const updated = JSON.parse(JSON.stringify(prev));
      const keys = arrayPath.split(".");
      let arr = updated;
      for (const key of keys) arr = arr[key];
      arr.splice(index, 1);
      return updated;
    });
  };

  const handleSave = async (newStatus?: string) => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/proposals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: content.title,
          content,
          status: newStatus || status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      if (newStatus === "sent") {
        router.push(`/dashboard/proposals/${id}`);
      } else {
        setSuccess("Proposal saved successfully!");
        setStatus(data.proposal?.status || status);
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!proposal || !content) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Proposal not found</p>
        <Link href="/dashboard/proposals" className="text-emerald-600 hover:underline mt-2 inline-block">Back to Proposals</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/proposals/${id}`} className="p-2 hover:bg-slate-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Edit Proposal</h1>
            <p className="text-slate-500 text-sm">Status: <span className="font-medium capitalize">{status}</span></p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
          {(status === "draft" || status === "viewed" || status === "rejected") && (
            <button
              onClick={() => handleSave("sent")}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {status === "draft" ? "Send to Client" : "Resend"}
            </button>
          )}
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
      {success && <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700 flex items-center gap-2"><CheckCircle className="w-4 h-4" />{success}</div>}

      {/* Title & Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-500 uppercase mb-4">Title & Summary</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              value={content.title || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Summary</label>
            <textarea
              value={content.summary || ""}
              onChange={(e) => updateContent("summary", e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Scope */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase flex items-center gap-2">
            <FileText className="w-4 h-4" /> Scope of Work
          </h2>
          <button
            onClick={() => setContent((prev: any) => ({ ...prev, scope: [...(prev.scope || []), { title: "", description: "" }] }))}
            className="flex items-center gap-1 text-xs px-2 py-1 text-emerald-600 hover:bg-emerald-50 rounded"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-4">
          {content.scope?.map((item: any, i: number) => (
            <div key={i} className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateContent(`scope.${i}.title`, e.target.value)}
                  placeholder="Scope item title"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
                <button onClick={() => removeItem("scope", i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
              <textarea
                value={item.description}
                onChange={(e) => updateContent(`scope.${i}.description`, e.target.value)}
                rows={2}
                placeholder="Description..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase flex items-center gap-2">
            <Clock className="w-4 h-4" /> Timeline
          </h2>
          <button
            onClick={() => setContent((prev: any) => ({ ...prev, timeline: [...(prev.timeline || []), { phase: "", duration: "", deliverables: [] }] }))}
            className="flex items-center gap-1 text-xs px-2 py-1 text-emerald-600 hover:bg-emerald-50 rounded"
          >
            <Plus className="w-3 h-3" /> Add Phase
          </button>
        </div>
        <div className="space-y-4">
          {content.timeline?.map((phase: any, i: number) => (
            <div key={i} className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-sm font-bold text-emerald-700 flex-shrink-0">{i + 1}</div>
                <input
                  type="text"
                  value={phase.phase}
                  onChange={(e) => updateContent(`timeline.${i}.phase`, e.target.value)}
                  placeholder="Phase name"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  value={phase.duration}
                  onChange={(e) => updateContent(`timeline.${i}.duration`, e.target.value)}
                  placeholder="Duration"
                  className="w-32 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-emerald-500"
                />
                <button onClick={() => removeItem("timeline", i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Packages */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-500 uppercase flex items-center gap-2 mb-4">
          <DollarSign className="w-4 h-4" /> Pricing Packages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {content.packages?.map((pkg: any, i: number) => (
            <div key={i} className={`rounded-xl border-2 p-5 ${i === 1 ? "border-emerald-500 bg-emerald-50" : "border-slate-200"}`}>
              {i === 1 && <span className="text-xs font-bold text-emerald-600 uppercase mb-2 block">Recommended</span>}
              <input
                type="text"
                value={pkg.name}
                onChange={(e) => updateContent(`packages.${i}.name`, e.target.value)}
                className="w-full font-bold text-slate-900 border border-slate-300 rounded px-2 py-1.5 mb-2 focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex items-center gap-1 mb-3">
                <span className="text-lg font-bold text-slate-400">$</span>
                <input
                  type="number"
                  value={pkg.price}
                  onChange={(e) => updateContent(`packages.${i}.price`, Number(e.target.value))}
                  className="w-full text-2xl font-bold border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>
              <div className="space-y-2">
                {pkg.features?.map((f: string, j: number) => (
                  <div key={j} className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <input
                      type="text"
                      value={f}
                      onChange={(e) => {
                        const features = [...pkg.features];
                        features[j] = e.target.value;
                        updateContent(`packages.${i}.features`, features);
                      }}
                      className="flex-1 text-sm border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-emerald-500 text-slate-700"
                    />
                    <button onClick={() => {
                      const features = pkg.features.filter((_: any, k: number) => k !== j);
                      updateContent(`packages.${i}.features`, features);
                    }} className="text-red-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
                <button
                  onClick={() => updateContent(`packages.${i}.features`, [...(pkg.features || []), "New feature"])}
                  className="text-xs text-emerald-600 hover:text-emerald-700 ml-5"
                >
                  + Add feature
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terms */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-500 uppercase mb-4">Terms & Conditions</h2>
        <textarea
          value={content.terms || ""}
          onChange={(e) => updateContent("terms", e.target.value)}
          rows={4}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pb-8">
        <Link href={`/dashboard/proposals/${id}`} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium">← Back to Proposal</Link>
        <div className="flex gap-3">
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
          {(status === "draft" || status === "viewed" || status === "rejected") && (
            <button
              onClick={() => handleSave("sent")}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {status === "draft" ? "Send to Client" : "Resend to Client"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
