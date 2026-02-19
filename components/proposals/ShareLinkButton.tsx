"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Share2,
  Link2,
  Mail,
  MessageCircle,
  X,
} from "lucide-react";

export default function ShareLinkButton({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Always use window.location.origin for correct URL
  const url = typeof window !== "undefined" ? `${window.location.origin}/p/${slug}` : `/p/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 flex items-center gap-1.5"
      >
        <Share2 className="w-3 h-3" />
        Share
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Share2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Share Proposal</h3>
              <p className="text-sm text-slate-500 mt-1">
                Send this link to your client
              </p>
            </div>

            {/* Copy Link */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1.5">
                Proposal Link
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg min-w-0 overflow-hidden">
                  <Link2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-700 truncate font-mono block overflow-hidden text-ellipsis whitespace-nowrap">
                    {url}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex-shrink-0 ${
                    copied
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Hi! Here's your proposal: ${url}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-slate-700">
                  Share via WhatsApp
                </span>
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(`Proposal: ${title}`)}&body=${encodeURIComponent(`Hi,\n\nPlease review the proposal here:\n${url}\n\nBest regards`)}`}
                className="flex items-center gap-3 w-full px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">
                  Share via Email App
                </span>
              </a>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Link2 className="w-5 h-5 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">
                  Preview Proposal
                </span>
              </a>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="w-full mt-4 py-2.5 text-sm text-slate-500 hover:text-slate-700 font-medium"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
