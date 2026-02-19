import Link from "next/link";
import { Zap, Mail, ArrowLeft } from "lucide-react";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-10">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">ProposalAI</span>
        </Link>

        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-blue-500" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-3">Check your email</h1>
        <p className="text-slate-500 leading-relaxed">
          We&apos;ve sent you a confirmation email. Click the link in the email to verify your account and get started.
        </p>

        <div className="mt-10">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
