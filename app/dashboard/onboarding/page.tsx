"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, User, Building, Palette, ArrowRight, ArrowLeft, Loader2, CheckCircle } from "lucide-react";

const industries = [
  "Web Development", "Mobile App Development", "UI/UX Design", "Graphic Design",
  "Marketing", "SEO & Digital Marketing", "Content Writing", "Video Production",
  "Photography", "Consulting", "E-commerce", "Social Media Management", "Other",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    business_name: "",
    industry: "",
    website: "",
    brand_color: "#10b981",
  });

  const handleFinish = async () => {
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      router.push("/dashboard");
    } catch {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">ProposalAI</span>
          </div>
          <p className="text-slate-500 mt-2">Let&apos;s set up your account in 3 quick steps</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors ${s <= step ? "bg-emerald-500" : "bg-slate-200"}`} />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">About You</h2>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Industry</label>
                <select
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                >
                  <option value="">Select your industry...</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Business Info */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <Building className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">Your Business</h2>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Business / Freelance Name</label>
                <input
                  type="text"
                  value={form.business_name}
                  onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                  placeholder="Acme Design Studio"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Website (optional)</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://yoursite.com"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Branding */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">Brand Color</h2>
              </div>
              <p className="text-sm text-slate-500">Choose a color that represents your brand. This will be used on your proposals.</p>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={form.brand_color}
                  onChange={(e) => setForm({ ...form, brand_color: e.target.value })}
                  className="w-16 h-16 rounded-xl border border-slate-200 cursor-pointer"
                />
                <div className="flex gap-2 flex-wrap">
                  {["#10b981", "#3b82f6", "#6366f1", "#ec4899", "#f59e0b", "#ef4444", "#0ea5e9", "#8b5cf6"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setForm({ ...form, brand_color: color })}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${form.brand_color === color ? "border-slate-900 scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-slate-200 bg-slate-50">
                <p className="text-xs text-slate-500 mb-2">Preview</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: form.brand_color }}>
                    {form.business_name?.[0]?.toUpperCase() || "P"}
                  </div>
                  <span className="font-semibold text-slate-900">{form.business_name || "Your Business"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <button
                onClick={() => router.push("/dashboard")}
                className="text-sm text-slate-400 hover:text-slate-600"
              >
                Skip for now
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Finish Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
