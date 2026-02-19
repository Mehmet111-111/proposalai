"use client";

import { useState, useEffect } from "react";
import { User, Building, Globe, Palette, Save, CheckCircle, Loader2, CreditCard, Zap, Crown } from "lucide-react";
import { initializePaddle } from "@paddle/paddle-js";

const PLANS = [
  {
    key: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    proposals: 3,
    features: ["3 proposals/month", "Basic templates", "Email notifications", "ProposalAI watermark"],
  },
  {
    key: "starter",
    name: "Starter",
    price: "$12",
    period: "/month",
    proposals: 20,
    priceId: process.env.NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID || "",
    features: ["20 proposals/month", "Remove watermark", "Proposal tracking", "5 templates", "Client management"],
  },
  {
    key: "pro",
    name: "Pro",
    price: "$29",
    period: "/month",
    proposals: 999,
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID || "",
    popular: true,
    features: ["Unlimited proposals", "Smart invoicing", "Custom branding", "Analytics dashboard", "All templates", "Priority support"],
  },
  {
    key: "agency",
    name: "Agency",
    price: "$79",
    period: "/month",
    proposals: 999,
    priceId: process.env.NEXT_PUBLIC_PADDLE_AGENCY_PRICE_ID || "",
    features: ["Everything in Pro", "5 team members", "Client portal", "API access", "White label", "Dedicated support"],
  },
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [paddle, setPaddle] = useState<any>(null);
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [currentPlan, setCurrentPlan] = useState("free");
  const [profile, setProfile] = useState({
    full_name: "",
    business_name: "",
    industry: "",
    website: "",
    phone: "",
    brand_color: "#10b981",
  });

  useEffect(() => {
    fetchProfile();
    initPaddle();
  }, []);

  const initPaddle = async () => {
    try {
      const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
      const environment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as "sandbox" | "production" || "sandbox";
      if (clientToken) {
        const paddleInstance = await initializePaddle({
          token: clientToken,
          environment,
        });
        setPaddle(paddleInstance);
      }
    } catch (err) {
      console.error("Paddle init failed:", err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.profile) {
        setProfile({
          full_name: data.profile.full_name || "",
          business_name: data.profile.business_name || "",
          industry: data.profile.industry || "",
          website: data.profile.website || "",
          phone: data.profile.phone || "",
          brand_color: data.profile.brand_color || "#10b981",
        });
        setCurrentPlan(data.profile.subscription_plan || "free");
        setUserId(data.profile.id || "");
        setUserEmail(data.profile.email || "");
      }
    } catch (err) {
      console.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = (priceId: string) => {
    if (!paddle || !priceId) {
      alert("Payment system is not configured yet. Please set up Paddle price IDs.");
      return;
    }
    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: { user_id: userId },
      customer: { email: userEmail },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your profile and subscription</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <p className="text-sm text-emerald-800 font-medium">Settings saved successfully!</p>
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-600" />
          Personal Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Business Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <Building className="w-5 h-5 text-emerald-600" />
          Business Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
            <input
              type="text"
              value={profile.business_name}
              onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
              placeholder="Your business or freelance name"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
            <select
              value={profile.industry}
              onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
            >
              <option value="">Select industry...</option>
              <option value="Web Development">Web Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Consulting">Consulting</option>
              <option value="Photography">Photography</option>
              <option value="Video Production">Video Production</option>
              <option value="Writing">Writing</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
            <input
              type="url"
              value={profile.website}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              placeholder="https://yoursite.com"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Brand Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <Palette className="w-5 h-5 text-emerald-600" />
          Branding
        </h2>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Brand Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={profile.brand_color}
              onChange={(e) => setProfile({ ...profile, brand_color: e.target.value })}
              className="w-12 h-12 rounded-lg border border-slate-300 cursor-pointer"
            />
            <input
              type="text"
              value={profile.brand_color}
              onChange={(e) => setProfile({ ...profile, brand_color: e.target.value })}
              className="w-32 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">Used on your public proposal pages</p>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-600" />
          Subscription
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.key;
            const isUpgrade = !isCurrent && plan.key !== "free";
            return (
              <div
                key={plan.key}
                className={`rounded-xl border-2 p-5 relative ${
                  isCurrent
                    ? "border-emerald-500 bg-emerald-50"
                    : plan.popular
                      ? "border-emerald-300"
                      : "border-slate-200"
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded">
                    Current Plan
                  </div>
                )}
                {plan.popular && !isCurrent && (
                  <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded">
                    Most Popular
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  {plan.key === "free" ? <Zap className="w-4 h-4 text-slate-400" /> :
                   plan.key === "agency" ? <Crown className="w-4 h-4 text-purple-500" /> :
                   <Zap className="w-4 h-4 text-emerald-500" />}
                  <h3 className="font-semibold text-slate-900">{plan.name}</h3>
                </div>
                <div className="mb-3">
                  <span className="text-2xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-sm text-slate-500">{plan.period}</span>
                </div>
                <ul className="space-y-1.5 mb-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {isUpgrade && (
                  <button
                    onClick={() => handleUpgrade((plan as any).priceId)}
                    className="w-full py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Upgrade to {plan.name}
                  </button>
                )}
                {isCurrent && plan.key !== "free" && (
                  <p className="text-xs text-center text-emerald-600 font-medium">Active subscription</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
          ) : (
            <><Save className="w-4 h-4" /> Save Settings</>
          )}
        </button>
      </div>
    </div>
  );
}
