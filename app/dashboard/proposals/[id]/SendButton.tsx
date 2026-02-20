"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle, Mail } from "lucide-react";

export default function SendProposalButton({
  proposalId,
  clientEmail,
  currentStatus,
}: {
  proposalId: string;
  clientEmail?: string;
  currentStatus: string;
}) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(currentStatus === "sent");
  const [result, setResult] = useState<string | null>(null);

  const handleSend = async () => {
    if (sending) return;

    const confirmed = window.confirm(
      clientEmail
        ? `Send this proposal to ${clientEmail}?`
        : "Mark this proposal as sent? (No client email found — share the link manually)"
    );
    if (!confirmed) return;

    setSending(true);
    setResult(null);

    try {
      const res = await fetch(`/api/proposals/${proposalId}/send`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        setSent(true);
        setResult(data.message);
      } else {
        setResult(data.error || "Failed to send");
      }
    } catch {
      setResult("Something went wrong");
    } finally {
      setSending(false);
    }
  };

  if (sent || currentStatus === "accepted") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium px-3 py-1.5">
        <CheckCircle className="w-3.5 h-3.5" />
        {currentStatus === "accepted" ? "Accepted" : "Sent"}
        {result && <span className="text-slate-400 ml-1">— {result}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleSend}
        disabled={sending}
        className="flex items-center gap-1.5 text-xs px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {sending ? (
          <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</>
        ) : (
          <><Send className="w-3.5 h-3.5" /> {clientEmail ? "Send to Client" : "Mark as Sent"}</>
        )}
      </button>
      {clientEmail && (
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <Mail className="w-3 h-3" /> {clientEmail}
        </span>
      )}
      {result && <span className="text-xs text-red-500">{result}</span>}
    </div>
  );
}
