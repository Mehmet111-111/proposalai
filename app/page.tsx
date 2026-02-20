import {
  Zap,
  FileText,
  ArrowRight,
  Check,
  Sparkles,
  Send,
  BarChart3,
  ChevronRight,
  Eye,
  Receipt,
  Palette,
  Globe,
  X,
  MousePointer,
  Timer,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description:
      "Describe your project. AI creates a complete proposal with scope, deliverables, timeline, and 3-tier pricing.",
  },
  {
    icon: Eye,
    title: "Real-Time Tracking",
    description:
      "Get notified when clients open your proposal. See which package they're considering.",
  },
  {
    icon: Receipt,
    title: "Auto Invoicing",
    description:
      "Client accepts → invoice auto-generated. PDF ready. Payment status tracked.",
  },
  {
    icon: Send,
    title: "One-Click Sharing",
    description:
      "Share via link, WhatsApp, or email. Clients view, choose a package, and accept online.",
  },
  {
    icon: Palette,
    title: "Custom Branding",
    description:
      "Your brand colors, business name, and logo. Pro users remove the watermark entirely.",
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    description:
      "USD, EUR, GBP, TRY, CAD, AUD. Everything adjusts automatically — proposals, invoices, PDFs.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect to get started",
    features: [
      "3 proposals/month",
      "AI generation",
      "Link sharing",
      "Email notifications",
      "PDF export",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Starter",
    price: "$9",
    period: "/mo",
    description: "For growing freelancers",
    features: [
      "20 proposals/month",
      "Remove watermark",
      "View tracking",
      "Client management",
      "Invoice generation",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    description: "For serious professionals",
    features: [
      "Unlimited proposals",
      "Custom branding",
      "Analytics dashboard",
      "Smart invoicing",
      "Priority support",
      "All future features",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Agency",
    price: "$39",
    period: "/mo",
    description: "For teams & agencies",
    features: [
      "Everything in Pro",
      "5 team members",
      "Client portal",
      "API access",
      "White label",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  {
    q: "How does the AI generate proposals?",
    a: "Our AI analyzes your project description, industry, and requirements to create a comprehensive proposal with scope of work, timeline, deliverables, and 3-tier pricing — all tailored to your specific project.",
  },
  {
    q: "Can I edit the AI-generated content?",
    a: "Every section is fully editable — title, scope, timeline, pricing packages, features, and terms. The AI gives you a strong starting point that you customize to perfection.",
  },
  {
    q: "How do clients accept proposals?",
    a: "Clients get a unique link — no account needed. They view the proposal, choose a package, and click Accept. You're notified instantly and an invoice auto-generates.",
  },
  {
    q: "What currencies are supported?",
    a: "USD, EUR, GBP, TRY, CAD, and AUD. Choose your currency when creating a proposal and everything — packages, invoices, PDFs — adjusts automatically.",
  },
  {
    q: "Is the free plan really free?",
    a: "Yes — 3 proposals per month with full AI generation, link sharing, email notifications, and PDF export. No credit card required, no time limit.",
  },
  {
    q: "Can I export proposals as PDF?",
    a: "Absolutely. Both you and your clients can download any proposal as a clean, professional PDF with your branding.",
  },
];

export default function LandingPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white relative">

      {/* ====== NAVBAR ====== */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-bold text-slate-900 tracking-tight">
              ProposalAI
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {["Features", "How It Works", "Pricing", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors font-medium"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block text-[13px] text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-[13px] px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ====== HERO ====== */}
      <section className="pt-28 sm:pt-36 pb-16 px-4 relative z-10 overflow-hidden">
        {/* Hero gradient mesh background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] bg-emerald-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-40" />
          <div className="absolute top-[0%] right-[15%] w-[400px] h-[400px] bg-teal-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-30" />
          <div className="absolute top-[20%] left-[40%] w-[350px] h-[350px] bg-sky-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-25" />
        </div>
        {/* Fade out bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[13px] font-medium text-emerald-700 mb-6">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            AI-powered proposals for freelancers
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 leading-[1.1] tracking-tight">
            Stop writing proposals.
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Start winning clients.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 mt-5 max-w-xl mx-auto leading-relaxed">
            Describe your project in a few sentences. AI generates a professional
            proposal with scope, timeline, and pricing.{" "}
            <span className="text-slate-700 font-medium">In under 2 minutes.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link
              href="/register"
              className="group flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-200/50 text-[15px]"
            >
              Create Your First Proposal
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-1.5 px-5 py-3 text-slate-500 font-medium hover:text-slate-900 transition-colors text-[15px] group"
            >
              See how it works
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Free forever • No credit card required
          </p>
        </div>
      </section>

      {/* ====== SOCIAL PROOF BAR ====== */}
      <section className="pb-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              { icon: Globe, label: "Web Developers" },
              { icon: Palette, label: "Designers" },
              { icon: TrendingUp, label: "Marketers" },
              { icon: FileText, label: "Copywriters" },
              { icon: BarChart3, label: "Consultants" },
              { icon: Sparkles, label: "Agencies" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 text-slate-300"
              >
                <item.icon className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section id="how-it-works" className="py-16 sm:py-20 px-4 bg-slate-50/90 border-y border-slate-100 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">
              How It Works
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              From zero to proposal in 3 steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-[52px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-slate-200" />

            {[
              {
                num: "1",
                title: "Describe Your Project",
                desc: "Client name, project details, industry, currency. That's it.",
                icon: FileText,
              },
              {
                num: "2",
                title: "AI Generates Everything",
                desc: "Scope, timeline, milestones, Basic/Standard/Premium packages — in seconds.",
                icon: Sparkles,
              },
              {
                num: "3",
                title: "Send & Get Paid",
                desc: "Share the link. Client accepts. Invoice auto-generates. Done.",
                icon: Send,
              },
            ].map((step) => (
              <div key={step.num} className="text-center relative">
                <div className="w-12 h-12 bg-white border-2 border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                  <step.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-1">
                  Step {step.num}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-[260px] mx-auto">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== BEFORE / AFTER ====== */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              The old way vs. the{" "}
              <span className="text-emerald-600">smart way</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Old way */}
            <div className="rounded-xl border border-slate-200 p-6 bg-white">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                  <X className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-sm font-bold text-slate-900">Without ProposalAI</span>
              </div>
              <div className="space-y-3.5">
                {[
                  { icon: Timer, text: "2-3 hours per proposal" },
                  { icon: FileText, text: "Generic Word docs, no tracking" },
                  { icon: Send, text: "Email attachments that get lost" },
                  { icon: Receipt, text: "Manual invoicing after approval" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 text-red-300 flex-shrink-0" />
                    <span className="text-sm text-slate-500">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* New way */}
            <div className="rounded-xl border-2 border-emerald-200 p-6 bg-emerald-50/30">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold text-slate-900">With ProposalAI</span>
              </div>
              <div className="space-y-3.5">
                {[
                  { icon: Sparkles, text: "AI generates in under 2 minutes" },
                  { icon: MousePointer, text: "Beautiful online proposal page" },
                  { icon: Eye, text: "Real-time view tracking" },
                  { icon: Receipt, text: "Auto-generated invoices" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section id="features" className="py-16 sm:py-20 px-4 bg-slate-50/90 border-y border-slate-100 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">
              Features
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Everything you need to win clients
            </h2>
            <p className="text-base text-slate-500 mt-2 max-w-lg mx-auto">
              From first draft to final payment — one platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl border border-slate-100 p-6 hover:border-emerald-200 hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-[15px] font-bold text-slate-900 mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PRICING ====== */}
      <section id="pricing" className="py-16 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">
              Pricing
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Start free. Upgrade when ready.
            </h2>
            <p className="text-base text-slate-500 mt-2">
              No hidden fees. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-6 transition-all duration-300 relative ${
                  plan.popular
                    ? "border-2 border-emerald-500 bg-white shadow-lg shadow-emerald-100/50 scale-[1.02]"
                    : "border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                    Most Popular
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {plan.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {plan.description}
                  </p>
                </div>
                <div className="mb-5">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {plan.price}
                  </span>
                  <span className="text-sm text-slate-400 ml-0.5">
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-[13px] text-slate-600"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block w-full text-center py-2.5 rounded-lg font-semibold text-[13px] transition-all ${
                    plan.popular
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            All paid plans include a 7-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* ====== FAQ ====== */}
      <section id="faq" className="py-16 sm:py-20 px-4 bg-slate-50/90 border-t border-slate-100 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white rounded-lg border border-slate-100"
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none">
                  <span className="text-sm font-semibold text-slate-900 pr-4">
                    {faq.q}
                  </span>
                  <span className="text-slate-300 group-open:rotate-45 transition-transform duration-200 text-xl leading-none flex-shrink-0">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-4 -mt-1">
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="py-16 sm:py-20 px-4 border-t border-slate-100 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Ready to create your first proposal?
          </h2>
          <p className="text-base text-slate-500 mt-3 max-w-md mx-auto">
            Join freelancers who create professional proposals in minutes, not hours.
          </p>
          <div className="mt-8">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-200/50 text-[15px]"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Free forever • No credit card required
          </p>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="py-8 border-t border-slate-100 px-4 bg-white relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-md flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900">ProposalAI</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <a href="#features" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Features</a>
            <a href="#pricing" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Pricing</a>
            <a href="#faq" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">FAQ</a>
            <Link href="/privacy" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Terms</Link>
            <Link href="/login" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Sign In</Link>
          </div>
          <p className="text-xs text-slate-300">© {currentYear} ProposalAI</p>
        </div>
      </footer>

      {/* Summary marker removal */}
      <style dangerouslySetInnerHTML={{ __html: `
        details > summary::-webkit-details-marker,
        details > summary::marker { display: none; content: ""; }
        html { scroll-behavior: smooth; }
      `}} />
    </div>
  );
}
