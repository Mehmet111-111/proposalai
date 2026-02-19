import Link from "next/link";
import { Zap, Mail } from "lucide-react";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900">ProposalAI</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Check your email</h2>
          <p className="text-sm text-slate-500 mb-6">
            We sent a confirmation link to your email address. Click the link to activate your account.
          </p>
          <Link
            href="/login"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
