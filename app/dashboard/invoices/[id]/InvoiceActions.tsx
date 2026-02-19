"use client";

import { useState } from "react";
import { CheckCircle, Send, Loader2 } from "lucide-react";

export default function InvoiceActions({
  invoiceId,
  status,
  clientEmail,
}: {
  invoiceId: string;
  status: string;
  clientEmail?: string;
}) {
  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState("");

  const handleAction = async (action: "mark_paid" | "send_email") => {
    setLoading(action);
    setMessage("");
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(data.message || "Done!");
      // Reload after short delay
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading("");
    }
  };

  if (status === "paid" || status === "cancelled") return null;

  return (
    <div className="flex items-center gap-2">
      {message && (
        <span className="text-xs text-emerald-600 font-medium">{message}</span>
      )}
      {clientEmail && ["sent", "overdue"].includes(status) && (
        <button
          onClick={() => handleAction("send_email")}
          disabled={!!loading}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-50"
        >
          {loading === "send_email" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
          Send Reminder
        </button>
      )}
      {["sent", "overdue"].includes(status) && (
        <button
          onClick={() => handleAction("mark_paid")}
          disabled={!!loading}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading === "mark_paid" ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
          Mark as Paid
        </button>
      )}
    </div>
  );
}
