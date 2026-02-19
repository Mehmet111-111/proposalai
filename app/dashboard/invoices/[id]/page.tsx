import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import InvoiceActions from "./InvoiceActions";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, clients(name, company, email)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!invoice) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, business_name, email, phone, website")
    .eq("id", user.id)
    .single();

  const items = (invoice.items as any[]) || [];
  const isOverdue = invoice.status === "sent" && new Date(invoice.due_date) < new Date();

  const statusMap: Record<string, { label: string; color: string; icon: any }> = {
    draft: { label: "Draft", color: "bg-slate-100 text-slate-700", icon: Clock },
    sent: isOverdue
      ? { label: "Overdue", color: "bg-red-100 text-red-700", icon: AlertCircle }
      : { label: "Sent", color: "bg-blue-100 text-blue-700", icon: Clock },
    paid: { label: "Paid", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
    overdue: { label: "Overdue", color: "bg-red-100 text-red-700", icon: AlertCircle },
    cancelled: { label: "Cancelled", color: "bg-slate-100 text-slate-500", icon: Clock },
  };
  const statusDisplay = statusMap[invoice.status as string] || { label: invoice.status, color: "bg-slate-100 text-slate-700", icon: Clock };

  const StatusIcon = statusDisplay.icon;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices" className="p-2 hover:bg-slate-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{invoice.invoice_number}</h1>
              <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${statusDisplay.color}`}>
                <StatusIcon className="w-3 h-3" />
                {statusDisplay.label}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              Created {new Date(invoice.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>
        <InvoiceActions invoiceId={invoice.id} status={invoice.status} clientEmail={invoice.clients?.email} />
      </div>

      {/* Invoice Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8" id="invoice-content">
        {/* From / To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-200">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">From</p>
            <p className="text-sm font-medium text-slate-900">{profile?.business_name || profile?.full_name || "—"}</p>
            {profile?.email && <p className="text-sm text-slate-500">{profile.email}</p>}
            {profile?.phone && <p className="text-sm text-slate-500">{profile.phone}</p>}
            {profile?.website && <p className="text-sm text-slate-500">{profile.website}</p>}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Bill To</p>
            <p className="text-sm font-medium text-slate-900">{invoice.clients?.name || "—"}</p>
            {invoice.clients?.company && <p className="text-sm text-slate-500">{invoice.clients.company}</p>}
            {invoice.clients?.email && <p className="text-sm text-slate-500">{invoice.clients.email}</p>}
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Invoice #</p>
            <p className="text-sm font-medium text-slate-900 mt-1">{invoice.invoice_number}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Issue Date</p>
            <p className="text-sm font-medium text-slate-900 mt-1">{new Date(invoice.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Due Date</p>
            <p className={`text-sm font-medium mt-1 ${isOverdue ? "text-red-600" : "text-slate-900"}`}>
              {new Date(invoice.due_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Currency</p>
            <p className="text-sm font-medium text-slate-900 mt-1">{invoice.currency || "USD"}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Description</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Qty</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Unit Price</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item: any, i: number) => (
                <tr key={i}>
                  <td className="px-4 py-3 text-sm text-slate-900">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 text-right">${item.unit_price?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 text-right">${item.total?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="text-slate-900">${invoice.subtotal?.toLocaleString()}</span>
            </div>
            {invoice.tax_rate > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax ({invoice.tax_rate}%)</span>
                <span className="text-slate-900">${invoice.tax_amount?.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
              <span className="text-slate-900">Total</span>
              <span className="text-slate-900">${invoice.total_amount?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Notes</p>
            <p className="text-sm text-slate-600">{invoice.notes}</p>
          </div>
        )}

        {/* Paid stamp */}
        {invoice.status === "paid" && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 border-2 border-emerald-500 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <span className="text-lg font-bold text-emerald-600">PAID</span>
              {invoice.paid_at && (
                <span className="text-sm text-emerald-500 ml-2">
                  on {new Date(invoice.paid_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Link to proposal */}
      {invoice.proposal_id && (
        <div className="text-center">
          <Link
            href={`/dashboard/proposals/${invoice.proposal_id}`}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            View linked proposal →
          </Link>
        </div>
      )}
    </div>
  );
}
