import {
  Zap,
  FileText,
  Clock,
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
  Shield,
  X,
  MousePointer,
  Timer,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import LandingAnimations from "@/components/landing/LandingAnimations";

const features = [
  {
    icon: Sparkles,
    title: "AI That Understands Your Work",
    description:
      "Tell it about your project in plain language. Get back a polished proposal with scope, deliverables, timeline, and smart 3-tier pricing.",
    visual: "ai",
  },
  {
    icon: Eye,
    title: "Know When They Look",
    description:
      "Real-time notifications when your client opens the proposal. See exactly when they viewed it and which package caught their eye.",
    visual: "tracking",
  },
  {
    icon: Receipt,
    title: "Invoices on Autopilot",
    description:
      "Client clicks Accept → Invoice generated instantly. No manual work. PDF ready. Payment tracking built in.",
    visual: "invoice",
  },
  {
    icon: Palette,
    title: "Your Brand, Your Colors",
    description:
      "Custom brand colors, business name, and professional layout. Pro users remove the watermark entirely.",
    visual: "brand",
  },
];

const steps = [
  {
    num: "01",
    title: "Describe Your Project",
    description: "Client name, project details, industry, currency. That's it.",
    icon: FileText,
    color: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-200",
  },
  {
    num: "02",
    title: "AI Does the Heavy Lifting",
    description:
      "Scope of work, timeline with milestones, Basic/Standard/Premium packages — generated in seconds.",
    icon: Sparkles,
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-200",
  },
  {
    num: "03",
    title: "Send & Get Paid",
    description:
      "Share via link, WhatsApp, or email. Client accepts, invoice auto-generates. You get paid.",
    icon: Send,
    color: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-200",
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
    gradient: "",
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
    gradient: "",
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
    gradient: "from-emerald-500 to-teal-600",
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
    gradient: "",
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
    <div className="min-h-screen bg-[#fafaf9] overflow-hidden">
      <LandingAnimations />

      {/* ====== NAVBAR ====== */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-300" id="landing-nav">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 mt-2 px-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-slate-200/60 shadow-sm shadow-slate-100/50">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-[15px] font-bold text-slate-900 tracking-tight">
                ProposalAI
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {["Features", "How It Works", "Pricing", "FAQ"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  className="px-3 py-1.5 text-[13px] text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-all font-medium"
                >
                  {item}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden sm:block text-[13px] text-slate-500 hover:text-slate-900 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-[13px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-slate-300/30"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ====== HERO ====== */}
      <section className="relative pt-32 sm:pt-40 pb-8 px-4">
        {/* Ambient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px]" />
          <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-teal-100/30 rounded-full blur-[100px]" />
          <div className="absolute top-60 left-1/2 w-[300px] h-[300px] bg-sky-100/20 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200/80 rounded-full text-[13px] font-medium text-slate-600 shadow-sm mb-8 animate-fade-in"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            AI-powered proposals for freelancers
          </div>

          {/* Headline */}
          <h1 className="text-[2.75rem] sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight animate-fade-in-up" style={{ fontFamily: 'var(--font-display)' }}>
            Stop writing proposals.
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Start winning clients.
            </span>
          </h1>

          {/* Subhead */}
          <p className="text-lg sm:text-xl text-slate-500 mt-6 max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delay font-normal">
            Describe your project in a few sentences. AI generates a complete proposal
            with scope, timeline, and pricing.{" "}
            <span className="text-slate-700 font-medium">In under 2 minutes.</span>
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 animate-fade-in-up-delay-2">
            <Link
              href="/register"
              className="group flex items-center gap-2.5 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-emerald-200/50 text-base"
            >
              Create Your First Proposal
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-6 py-3.5 text-slate-500 font-medium hover:text-slate-900 transition-colors text-base group"
            >
              See how it works
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
          <p className="text-[13px] text-slate-400 mt-4">
            Free forever • No credit card • Setup in 30 seconds
          </p>
        </div>

        {/* ====== HERO MOCKUP ====== */}
        <div className="max-w-5xl mx-auto mt-16 relative animate-fade-in-up-delay-3">
          {/* Glow behind */}
          <div className="absolute -inset-4 bg-gradient-to-b from-emerald-100/40 via-transparent to-transparent rounded-3xl blur-2xl pointer-events-none" />

          <div className="relative bg-slate-900 rounded-2xl p-1.5 shadow-2xl shadow-slate-400/20">
            <div className="bg-white rounded-xl overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 mx-8">
                  <div className="bg-white rounded-lg px-4 py-1.5 text-xs text-slate-400 text-center border border-slate-100 flex items-center justify-center gap-2">
                    <Shield className="w-3 h-3 text-emerald-500" />
                    proposalai.app/p/web-redesign-acme
                  </div>
                </div>
              </div>

              {/* Actual proposal mockup content */}
              <div className="p-6 sm:p-10 bg-gradient-to-b from-white to-slate-50/50">
                {/* Proposal header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">DS</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-700">DesignStudio</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                      Website Redesign & Development
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Proposal for Acme Corp • Valid until March 15, 2026
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full font-medium border border-blue-100">
                    <Eye className="w-3 h-3" />
                    Viewed
                  </span>
                </div>

                {/* Package cards */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {[
                    { name: "Basic", price: "$2,500", features: ["5-page website", "Mobile responsive", "Basic SEO", "2 revisions"], selected: false },
                    { name: "Standard", price: "$4,800", features: ["10-page website", "Custom animations", "Advanced SEO", "CMS integration", "5 revisions"], selected: true },
                    { name: "Premium", price: "$8,500", features: ["Unlimited pages", "E-commerce ready", "Full SEO suite", "Custom features", "Priority support"], selected: false },
                  ].map((pkg) => (
                    <div
                      key={pkg.name}
                      className={`rounded-xl p-3 sm:p-5 border-2 transition-all ${
                        pkg.selected
                          ? "border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-100/50 scale-[1.02]"
                          : "border-slate-100 bg-white"
                      }`}
                    >
                      {pkg.selected && (
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                          ✓ Selected
                        </span>
                      )}
                      <p className="font-semibold text-slate-900 text-sm mt-1">{pkg.name}</p>
                      <p className="text-xl sm:text-2xl font-extrabold text-slate-900 my-2">
                        {pkg.price}
                      </p>
                      <div className="space-y-1.5 hidden sm:block">
                        {pkg.features.map((f) => (
                          <p key={f} className="text-[11px] text-slate-500 flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                            {f}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Accept button */}
                <div className="flex items-center justify-center gap-3 mt-6">
                  <div className="px-8 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-200/50 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Accept Proposal
                  </div>
                  <div className="px-6 py-3 border-2 border-slate-200 text-slate-400 text-sm font-medium rounded-xl">
                    Decline
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating notification cards */}
          <div className="absolute -left-4 sm:-left-12 top-1/3 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 p-3 sm:p-4 animate-float-slow hidden sm:block max-w-[220px]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Proposal Accepted!</p>
                <p className="text-[10px] text-slate-400">Invoice auto-generated</p>
              </div>
            </div>
          </div>

          <div className="absolute -right-4 sm:-right-8 top-1/4 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 p-3 sm:p-4 animate-float-delayed hidden sm:block max-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Client Viewed</p>
                <p className="text-[10px] text-slate-400">Just now • 2m read</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== LOGO / TRUST BAR ====== */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[13px] font-medium text-slate-400 uppercase tracking-wider mb-6">
            Built for freelancers who are tired of writing proposals
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-4">
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
                className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== BEFORE/AFTER ====== */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[13px] font-semibold text-emerald-600 uppercase tracking-wider mb-3">
              The difference
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
              The old way vs. the{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                smart way
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Old way */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 relative overflow-hidden group hover:border-red-200 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50/50 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <X className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Without ProposalAI</h3>
                    <p className="text-xs text-slate-400">The painful way</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: Timer, text: "2-3 hours writing each proposal", sub: "Copy-pasting from old docs" },
                    { icon: FileText, text: "Generic Word/Google Docs", sub: "No tracking, no analytics" },
                    { icon: Send, text: "Email attachments that get lost", sub: "\"Did you see my proposal?\"" },
                    { icon: Receipt, text: "Manual invoicing after approval", sub: "More hours wasted on admin" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <item.icon className="w-4 h-4 text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{item.text}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* New way */}
            <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/50 rounded-2xl border border-emerald-200/60 p-8 relative overflow-hidden group hover:border-emerald-300 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/30 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">With ProposalAI</h3>
                    <p className="text-xs text-emerald-600 font-medium">The smart way</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: Sparkles, text: "AI generates in under 2 minutes", sub: "Scope, timeline, 3-tier pricing" },
                    { icon: MousePointer, text: "Beautiful online proposal page", sub: "Client views, selects, accepts" },
                    { icon: Eye, text: "Real-time view tracking", sub: "Know exactly when they open it" },
                    { icon: Receipt, text: "Auto-generated invoices", sub: "Acceptance → Invoice → Get paid" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm border border-emerald-100">
                        <item.icon className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{item.text}</p>
                        <p className="text-xs text-emerald-600/70 mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section id="features" className="py-20 sm:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[13px] font-semibold text-emerald-600 uppercase tracking-wider mb-3">
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
              Everything from first draft to final payment
            </h2>
            <p className="text-lg text-slate-500 mt-4 max-w-2xl mx-auto">
              One platform to create, send, track, and get paid.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group bg-white rounded-2xl border border-slate-100 p-8 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-50 transition-all duration-500 relative overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-teal-50/0 group-hover:from-emerald-50/40 group-hover:to-teal-50/20 transition-all duration-500 rounded-2xl" />

                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-50 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-[15px]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Extra feature chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-12">
            {[
              "PDF Export",
              "Multi-Currency",
              "WhatsApp Sharing",
              "Email Notifications",
              "Client Management",
              "Dark Mode Proposals",
            ].map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-100 rounded-full text-[13px] text-slate-500 font-medium hover:border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all cursor-default"
              >
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-slate-900 px-4 relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-[13px] font-semibold text-emerald-400 uppercase tracking-wider mb-3">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              From zero to proposal in 3 steps
            </h2>
            <p className="text-lg text-slate-400 mt-4 max-w-2xl mx-auto">
              It&apos;s literally faster than making coffee.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="relative group">
                {/* Connector */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(100%-12px)] w-[calc(100%-56px)] z-10">
                    <div className="h-px bg-gradient-to-r from-slate-600 to-slate-700 relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-slate-600 rotate-45" />
                    </div>
                  </div>
                )}

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-7 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 hover:bg-slate-800/80">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg ${step.shadow} group-hover:scale-105 transition-transform`}
                  >
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Step {step.num}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Demo CTA */}
          <div className="text-center mt-14">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-emerald-500/20 text-sm"
            >
              Try it yourself — it&apos;s free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ====== PRICING ====== */}
      <section id="pricing" className="py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[13px] font-semibold text-emerald-600 uppercase tracking-wider mb-3">
              Pricing
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
              Start free. Scale when you&apos;re ready.
            </h2>
            <p className="text-lg text-slate-500 mt-4">
              No hidden fees. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 transition-all duration-300 relative ${
                  plan.popular
                    ? "bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl shadow-slate-400/20 scale-[1.03] border-0 lg:-mt-2 lg:mb-0"
                    : "bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-white text-[11px] font-bold rounded-full uppercase tracking-wide shadow-lg">
                    Most Popular
                  </div>
                )}
                <div className="mb-5">
                  <h3
                    className={`text-sm font-bold uppercase tracking-wider ${
                      plan.popular ? "text-emerald-400" : "text-slate-400"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-xs mt-1 ${
                      plan.popular ? "text-slate-400" : "text-slate-400"
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>
                <div className="mb-6">
                  <span
                    className={`text-4xl font-extrabold ${
                      plan.popular ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ml-1 ${
                      plan.popular ? "text-slate-400" : "text-slate-400"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-7">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-start gap-2.5 text-[13px] ${
                        plan.popular ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          plan.popular ? "text-emerald-400" : "text-emerald-500"
                        }`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block w-full text-center py-3 rounded-xl font-semibold text-[13px] transition-all ${
                    plan.popular
                      ? "bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-slate-400 mt-8">
            All paid plans include a 7-day free trial. No credit card required to start.
          </p>
        </div>
      </section>

      {/* ====== FAQ ====== */}
      <section id="faq" className="py-20 sm:py-28 bg-white px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[13px] font-semibold text-emerald-600 uppercase tracking-wider mb-3">
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
              Questions? Answered.
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-slate-50 rounded-xl hover:bg-emerald-50/40 transition-colors"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none">
                  <span className="text-[15px] font-semibold text-slate-900 pr-6">
                    {faq.q}
                  </span>
                  <span className="text-slate-300 group-open:rotate-45 transition-transform duration-200 text-2xl font-light flex-shrink-0 leading-none">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-5 -mt-1">
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
        </div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

        <div className="max-w-3xl mx-auto text-center relative px-4">
          <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Your next proposal could be{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              ready in 2 minutes
            </span>
          </h2>
          <p className="text-slate-400 mt-6 text-lg leading-relaxed max-w-xl mx-auto">
            Join freelancers who stopped wasting hours on proposals and started
            closing deals faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              href="/register"
              className="group flex items-center gap-2.5 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-emerald-500/20 text-lg"
            >
              Create Your First Proposal
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <p className="text-[13px] text-slate-500 mt-5">
            Free forever • No credit card • Cancel anytime
          </p>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="py-10 border-t border-slate-100 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-slate-900">ProposalAI</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a
                href="#features"
                className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                FAQ
              </a>
              <Link
                href="/privacy"
                className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/login"
                className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                Sign In
              </Link>
            </div>
            <p className="text-[13px] text-slate-300">
              © {currentYear} ProposalAI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
