"use client";

import { useState, useEffect } from "react";
import { User, Building, Globe, Palette, Save, CheckCircle, Loader2, CreditCard, Zap, Crown, Star } from "lucide-react";
import { initializePaddle } from "@paddle/paddle-js";
import { useToast } from "@/components/ui/Toast";
import { PADDLE_PLANS } from "@/lib/paddle";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [paddle, setPaddle] = useState<any>(null);
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [currentPlan, setCurrentPlan] = useState("free");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const { toast } = useToast();
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
      const environment = (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as "sandbox" | "production") || "sandbox";
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
        toast("success", "Settings saved successfully");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast("error", "Failed to save settings");
      }
    } catch {
      toast("error", "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = (planKey: string) => {
    const plan = PADDLE_PLANS[planKey as keyof typeof PADDLE_PLANS];
    if (!plan || !paddle) {
      toast("error", "Payment system not available");
      return;
    }
    const priceId = billingPeriod === "yearly" ? plan.yearlyPriceId : plan.monthlyPriceId;
    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: { user_id: userId },
      customer: { email: userEmail },
      settings: {
        successUrl: `${window.location.origin}/dashboard/settings?upgraded=true`,
        theme: "light",
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  const plans = [
    {
      key: "free",
      name: "Free",
      monthlyPrice: "$0",
      yearlyPrice: "$0",
      period: "forever",
      proposals: 3,
      features: ["3 proposals/month", "Basic templates", "Email notifications", "ProposalAI watermark"],
    },
    {
      key: "starter",
      name: "Starter",
      monthlyPrice: "$9",
      yearlyPrice: "$90",
      yearlySave: "Save $18",
      proposals: 20,
      features: PADDLE_PLANS.starter.features as unknown as string[],
    },
    {
      key: "pro",
      name: "Pro",
      monthlyPrice: "$19",
      yearlyPrice: "$190",
      yearlySave: "Save $38",
      popular: true,
      proposals: 999,
      features: PADDLE_PLANS.pro.features as unknown as string[],
    },
    {
      key: "agency",
      name: "Agency",
      monthlyPrice: "$39",
      yearlyPrice: "$390",
      yearlySave: "Save $78",
      proposals: 999,
      features: PADDLE_PLANS.agency.features as unknown as string[],
    },
  ];

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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            Subscription
          </h2>
          {/* Billing Toggle */}
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                billingPeriod === "monthly"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                billingPeriod === "yearly"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Yearly
              <span className="text-[10px] text-emerald-600 font-bold">-17%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.key;
            const isUpgrade = !isCurrent && plan.key !== "free";
            const isDowngrade = !isCurrent && plan.key === "free" && currentPlan !== "free";
            const price = billingPeriod === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
            const period = plan.key === "free" ? "forever" : billingPeriod === "yearly" ? "/year" : "/month";

            return (
              <div
                key={plan.key}
                className={`rounded-xl border-2 p-5 relative transition-all ${
                  isCurrent
                    ? "border-emerald-500 bg-emerald-50"
                    : plan.popular
                      ? "border-emerald-300 hover:border-emerald-400"
                      : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded">
                    Current Plan
                  </div>
                )}
                {plan.popular && !isCurrent && (
                  <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded flex items-center gap-1">
                    <Star className="w-3 h-3" /> Most Popular
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  {plan.key === "free" ? <Zap className="w-4 h-4 text-slate-400" /> :
                   plan.key === "agency" ? <Crown className="w-4 h-4 text-purple-500" /> :
                   <Zap className="w-4 h-4 text-emerald-500" />}
                  <h3 className="font-semibold text-slate-900">{plan.name}</h3>
                </div>
                <div className="mb-1">
                  <span className="text-2xl font-bold text-slate-900">{price}</span>
                  <span className="text-sm text-slate-500">{period}</span>
                </div>
                {billingPeriod === "yearly" && plan.yearlySave && (
                  <p className="text-xs text-emerald-600 font-medium mb-3">{plan.yearlySave}</p>
                )}
                {(!plan.yearlySave || billingPeriod === "monthly") && <div className="mb-3" />}
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
                    onClick={() => handleUpgrade(plan.key)}
                    className={`w-full py-2 text-sm font-medium rounded-lg transition-colors ${
                      plan.popular
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    Upgrade to {plan.name}
                  </button>
                )}
                {isCurrent && plan.key !== "free" && (
                  <p className="text-xs text-center text-emerald-600 font-medium py-2">Active subscription</p>
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
