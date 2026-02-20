import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, Mail, Building, FileText, DollarSign, Clock } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!client) notFound();

  const { data: proposals } = await supabase
    .from("proposals")
    .select("id, title, status, total_amount, currency, created_at")
    .eq("client_id", id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, invoice_number, status, total_amount, currency, created_at")
    .eq("client_id", id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const totalRevenue = proposals
    ?.filter((p) => p.status === "accepted")
    .reduce((sum, p) => sum + (p.total_amount || 0), 0) || 0;

  const statusColors: Record<string, string> = {
    draft: "bg-slate-100 text-slate-700",
    sent: "bg-blue-100 text-blue-700",
    viewed: "bg-amber-100 text-amber-700",
    accepted: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    expired: "bg-slate-100 text-slate-500",
    paid: "bg-emerald-100 text-emerald-700",
    overdue: "bg-red-100 text-red-700",
    cancelled: "bg-slate-100 text-slate-500",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/clients" className="p-2 hover:bg-slate-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            {client.company && (
              <span className="flex items-center gap-1 text-sm text-slate-500">
                <Building className="w-3.5 h-3.5" /> {client.company}
              </span>
            )}
            {client.email && (
              <span className="flex items-center gap-1 text-sm text-slate-500">
                <Mail className="w-3.5 h-3.5" /> {client.email}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-slate-500">Proposals</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{proposals?.length || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-slate-500">Revenue</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatPrice(totalRevenue, proposals?.[0]?.currency || "USD")}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-slate-500">Since</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {new Date(client.created_at).toLocaleDateString("en", { month: "short", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Proposals */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Proposals</h2>
        </div>
        {proposals && proposals.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {proposals.map((p: any) => (
              <Link key={p.id} href={`/dashboard/proposals/${p.id}`} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50">
                <div>
                  <p className="text-sm font-medium text-slate-900">{p.title}</p>
                  <p className="text-xs text-slate-500">{new Date(p.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">{formatPrice(p.total_amount || 0, p.currency)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[p.status] || ""}`}>
                    {p.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-sm text-slate-400">No proposals yet</div>
        )}
      </div>

      {/* Invoices */}
      {invoices && invoices.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Invoices</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {invoices.map((inv: any) => (
              <Link key={inv.id} href={`/dashboard/invoices/${inv.id}`} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50">
                <div>
                  <p className="text-sm font-medium text-slate-900">#{inv.invoice_number}</p>
                  <p className="text-xs text-slate-500">{new Date(inv.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">{formatPrice(inv.total_amount || 0, inv.currency)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[inv.status] || ""}`}>
                    {inv.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {client.notes && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-2">Notes</h2>
          <p className="text-sm text-slate-600">{client.notes}</p>
        </div>
      )}
    </div>
  );
}
