"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function DuplicateProposalButton({ proposalId }: { proposalId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDuplicate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/proposals/${proposalId}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast("success", "Proposal duplicated successfully");
      router.push(`/dashboard/proposals/${data.proposal.id}/edit`);
    } catch {
      toast("error", "Failed to duplicate proposal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDuplicate}
      disabled={loading}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Copy className="w-3 h-3" />}
      Duplicate
    </button>
  );
}
