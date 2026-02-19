import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Receipt, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-slate-100 text-slate-700" },
  sent: { label: "Sent", color: "bg-blue-100 text-blue-700" },
  paid: { label: "Paid", color: "bg-emerald-100 text-emerald-700" },
  overdue: { label: "Overdue", color: "bg-red-100 text-red-700" },
  cancelled: { label: "Cancelled", color: "bg-slate-100 text-slate-500" },
};

export default async function InvoicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, clients(name, company, email)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Stats
  const totalRevenue = invoices?.filter(i => i.status === "paid").reduce((sum, i) => sum + (i.total_amount || 0), 0) || 0;
  const pendingAmount = invoices?.filter(i => ["sent", "overdue"].includes(i.status)).reduce((sum, i) => sum + (i.total_amount || 0), 0) || 0;
  const overdueCount = invoices?.filter(i => i.status === "overdue").length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="text-slate-500 mt-1">Track payments and manage invoices</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Total Collected</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">${pendingAmount.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{overdueCount}</p>
              <p className="text-xs text-slate-500">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      {invoices && invoices.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Invoice</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Client</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Due Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((invoice: any) => {
                  const status = statusConfig[invoice.status] || statusConfig.draft;
                  const isOverdue = invoice.status === "sent" && new Date(invoice.due_date) < new Date();
                  return (
                    <tr key={invoice.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">{invoice.invoice_number}</p>
                        <p className="text-xs text-slate-500">{new Date(invoice.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-900">{invoice.clients?.name || "—"}</p>
                        <p className="text-xs text-slate-500">{invoice.clients?.company || ""}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-900">${invoice.total_amount?.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isOverdue ? "bg-red-100 text-red-700" : status.color}`}>
                          {isOverdue ? "Overdue" : status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`text-sm ${isOverdue ? "text-red-600 font-medium" : "text-slate-500"}`}>
                          {new Date(invoice.due_date).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/invoices/${invoice.id}`}
                            className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Receipt className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No invoices yet</h2>
          <p className="text-slate-400 mt-2 max-w-sm mx-auto">
            Invoices are automatically generated when clients accept your proposals. Create a proposal to get started.
          </p>
          <Link href="/dashboard/proposals/new" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors text-sm">
            Create a Proposal
          </Link>
        </div>
      )}
    </div>
  );
}
