import { Zap, FileText, Clock, Shield, Star, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Zap,
    title: "AI-Powered Proposals",
    description: "Generate professional proposals in seconds. Just describe your project and let AI do the rest.",
  },
  {
    icon: Clock,
    title: "2 Hours → 2 Minutes",
    description: "Stop wasting time on repetitive proposal writing. Focus on what you do best.",
  },
  {
    icon: FileText,
    title: "Smart Invoicing",
    description: "Auto-generate invoices when proposals are accepted. Get paid faster.",
  },
  {
    icon: Shield,
    title: "Track Everything",
    description: "Know when clients view your proposals. Get real-time notifications.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["3 proposals/month", "Basic templates", "Email notifications", "ProposalAI watermark"],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Starter",
    price: "$12",
    period: "/month",
    features: ["20 proposals/month", "Remove watermark", "Proposal tracking", "5 templates", "Client management"],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    features: ["Unlimited proposals", "Smart invoicing", "Custom branding", "Analytics dashboard", "All templates", "Priority support"],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Agency",
    price: "$79",
    period: "/month",
    features: ["Everything in Pro", "5 team members", "Client portal", "API access", "White label", "Dedicated support"],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">ProposalAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 font-medium">
              Sign In
            </Link>
            <Link href="/register" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            AI-powered proposal generator for freelancers
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight">
            Create winning proposals
            <br />
            <span className="text-emerald-600">in seconds, not hours</span>
          </h1>
          <p className="text-xl text-slate-600 mt-6 max-w-2xl mx-auto">
            ProposalAI uses artificial intelligence to generate professional proposals,
            track client engagement, and automate invoicing. Win more clients, get paid faster.
          </p>
          <div className="flex items-center justify-center gap-4 mt-10">
            <Link href="/register" className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors text-lg">
              Start Free — No Credit Card
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-sm text-slate-500 mt-4">Free plan includes 3 proposals/month</p>
        </div>
      </section>

      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Everything you need to win clients</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              From AI proposal generation to payment collection — all in one platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Simple, transparent pricing</h2>
            <p className="text-slate-600 mt-4">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-xl p-6 border-2 ${plan.popular ? "border-emerald-500 shadow-lg shadow-emerald-100 relative" : "border-slate-200"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500 text-sm">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full mt-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${plan.popular ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">Ready to win more clients?</h2>
          <p className="text-slate-400 mt-4 text-lg">
            Join thousands of freelancers who create proposals in minutes, not hours.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors text-lg mt-8">
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="py-8 border-t border-slate-200 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-600">ProposalAI</span>
          </div>
          <p className="text-sm text-slate-500">© 2025 ProposalAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}