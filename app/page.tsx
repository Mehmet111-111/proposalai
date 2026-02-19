import { Zap, FileText, Clock, Shield, Star, ArrowRight, Check, Sparkles, Send, BarChart3, Users, ChevronRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Proposals",
    description: "Describe your project in a few sentences. Our AI generates a complete, professional proposal with scope, timeline, and pricing.",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
  },
  {
    icon: Clock,
    title: "2 Hours → 2 Minutes",
    description: "Stop wasting time on repetitive proposal writing. Create polished proposals faster than ever before.",
    color: "from-blue-500 to-indigo-500",
    bg: "bg-blue-50",
  },
  {
    icon: Send,
    title: "One-Click Sharing",
    description: "Share proposals via link, WhatsApp, or email. Clients can view, accept, and sign — all online.",
    color: "from-purple-500 to-pink-500",
    bg: "bg-purple-50",
  },
  {
    icon: BarChart3,
    title: "Track & Get Paid",
    description: "Know when clients view your proposals. Auto-generate invoices on acceptance. Real-time analytics.",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
  },
];

const steps = [
  {
    num: "01",
    title: "Describe Your Project",
    description: "Enter client details and a brief project description. Choose your industry and currency.",
  },
  {
    num: "02",
    title: "AI Generates Everything",
    description: "Get a complete proposal with scope, timeline, 3-tier pricing, deliverables, and terms in seconds.",
  },
  {
    num: "03",
    title: "Send & Win Clients",
    description: "Share the link with your client. They review, choose a package, and accept — all from one page.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["3 proposals/month", "Basic AI generation", "Link sharing", "Email notifications"],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    features: ["20 proposals/month", "Remove watermark", "Proposal tracking", "Client management", "5 templates", "Email support"],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    features: ["Unlimited proposals", "Smart invoicing", "Custom branding", "Analytics dashboard", "All templates", "Priority support"],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Agency",
    price: "$39",
    period: "/month",
    features: ["Everything in Pro", "5 team members", "Client portal", "API access", "White label", "Dedicated support"],
    cta: "Contact Sales",
    popular: false,
  },
];

const stats = [
  { value: "2,500+", label: "Proposals Created" },
  { value: "$1.2M+", label: "Revenue Generated" },
  { value: "95%", label: "Time Saved" },
  { value: "4.9/5", label: "User Rating" },
];

export default function LandingPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-slate-100 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">ProposalAI</span>
          </Link>
          <div className="hidden sm:flex items-center gap-6">
            <a href="#features" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-20 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-emerald-50 via-teal-50 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute top-40 right-0 w-72 h-72 bg-gradient-to-bl from-blue-50 to-transparent rounded-full blur-3xl opacity-40 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            AI-powered proposal generator for freelancers
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
            Create winning proposals{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
              in seconds, not hours
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 mt-6 max-w-2xl mx-auto leading-relaxed">
            Describe your project, and let AI generate a professional proposal with scope, timeline, and pricing. Share it with one click. Get paid faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              href="/register"
              className="group flex items-center gap-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-emerald-200 text-lg"
            >
              Start Free — No Credit Card
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-7 py-3.5 text-slate-600 font-medium hover:text-slate-900 transition-colors text-lg"
            >
              See how it works
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <p className="text-sm text-slate-400 mt-5">Free plan includes 3 proposals/month • No credit card required</p>

          {/* Dashboard Mockup */}
          <div className="mt-16 relative mx-auto max-w-3xl">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-slate-900 rounded-2xl p-1 shadow-2xl shadow-slate-300/50">
              <div className="bg-slate-800 rounded-xl overflow-hidden">
                {/* Fake browser bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-slate-700 rounded-lg px-4 py-1.5 text-xs text-slate-400 text-center">proposalai.com/dashboard</div>
                  </div>
                </div>
                {/* Dashboard content mockup */}
                <div className="p-6 bg-slate-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="h-5 w-48 bg-slate-200 rounded" />
                      <div className="h-3 w-64 bg-slate-100 rounded mt-2" />
                    </div>
                    <div className="h-9 w-32 bg-emerald-500 rounded-lg" />
                  </div>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-white rounded-lg p-4 border border-slate-100">
                        <div className="h-3 w-16 bg-slate-100 rounded mb-3" />
                        <div className="h-6 w-12 bg-slate-200 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-lg border border-slate-100 p-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`flex items-center justify-between py-3 ${i < 3 ? "border-b border-slate-50" : ""}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${i === 1 ? "bg-emerald-400" : i === 2 ? "bg-blue-400" : "bg-amber-400"}`} />
                          <div>
                            <div className="h-3 w-40 bg-slate-100 rounded" />
                            <div className="h-2 w-24 bg-slate-50 rounded mt-1.5" />
                          </div>
                        </div>
                        <div className="h-3 w-16 bg-slate-100 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Everything you need to win clients</h2>
            <p className="text-lg text-slate-500 mt-4 max-w-2xl mx-auto">
              From AI proposal generation to payment collection — all in one platform designed for freelancers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-white rounded-2xl p-8 border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-slate-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Three steps to your next client</h2>
            <p className="text-lg text-slate-500 mt-4 max-w-2xl mx-auto">
              Go from zero to a professional proposal in under 2 minutes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-emerald-300 to-emerald-100" />
                )}
                <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center relative hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                    <span className="text-xl font-bold text-white">{step.num}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-500 mt-4">Start free. Upgrade when you need more power.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-7 border-2 transition-all duration-300 hover:shadow-lg relative ${
                  plan.popular
                    ? "border-emerald-500 shadow-xl shadow-emerald-100 bg-white scale-[1.02]"
                    : "border-slate-100 bg-white hover:border-slate-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                  <span className="text-slate-400 text-sm ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.popular
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 hover:shadow-xl"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto text-center relative px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Start winning more clients today
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to create your first proposal?
          </h2>
          <p className="text-slate-400 mt-5 text-lg leading-relaxed max-w-xl mx-auto">
            Join freelancers who create professional proposals in minutes, not hours. Free forever — no credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              href="/register"
              className="group flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-emerald-500/20 text-lg"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-slate-900">ProposalAI</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">Pricing</a>
              <Link href="/privacy" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">Privacy</Link>
              <Link href="/terms" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">Terms</Link>
              <Link href="/login" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">Sign In</Link>
            </div>
            <p className="text-sm text-slate-400">© {currentYear} ProposalAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
