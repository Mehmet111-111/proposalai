import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — ProposalAI",
  description: "ProposalAI privacy policy — how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-400 mb-10">Last updated: February 2026</p>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">1. Information We Collect</h2>
            <p>When you use ProposalAI, we collect information you provide directly, including your name, email address, business information, and proposal content. We also collect usage data such as pages visited, features used, and interaction timestamps to improve our service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">2. How We Use Your Information</h2>
            <p>We use your information to provide and improve our services, process your proposals and invoices, send transactional emails (proposal notifications, invoice reminders), and communicate important service updates. We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">3. Data Storage & Security</h2>
            <p>Your data is stored securely using Supabase (hosted on AWS) with encryption at rest and in transit. We implement industry-standard security measures including Row Level Security (RLS) to ensure your data is only accessible to you.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">4. Third-Party Services</h2>
            <p>We use the following third-party services: Supabase for database and authentication, Anthropic (Claude AI) for proposal generation, Resend for transactional emails, Paddle for payment processing, and Vercel for hosting. Each service has its own privacy policy governing data handling.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">5. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal information at any time through your account settings. You can export your data or request complete account deletion by contacting us at support@proposalai.app.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">6. Cookies</h2>
            <p>We use essential cookies for authentication and session management. We do not use third-party tracking cookies or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">7. Changes to This Policy</h2>
            <p>We may update this policy from time to time. We will notify you of significant changes via email or an in-app notification.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">8. Contact</h2>
            <p>If you have questions about this privacy policy, contact us at <a href="mailto:support@proposalai.app" className="text-emerald-600 hover:underline">support@proposalai.app</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
