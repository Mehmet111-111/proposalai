import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users, Plus, Mail, Building, FileText } from "lucide-react";
import Link from "next/link";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: clients } = await supabase
    .from("clients")
    .select("*, proposals(id, status, total_amount)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
          <p className="text-slate-500 mt-1">Manage your client relationships</p>
        </div>
      </div>

      {clients && clients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client: any) => {
            const totalRevenue = client.proposals
              ?.filter((p: any) => p.status === "accepted")
              .reduce((sum: number, p: any) => sum + (p.total_amount || 0), 0) || 0;
            const proposalCount = client.proposals?.length || 0;

            return (
              <Link key={client.id} href={`/dashboard/clients/${client.id}`} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow block">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-emerald-700">
                    {client.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900">{client.name}</h3>
                {client.company && (
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <Building className="w-3 h-3" /> {client.company}
                  </p>
                )}
                {client.email && (
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3" /> {client.email}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-500">{proposalCount} proposals</span>
                  </div>
                  <div className="text-xs font-semibold text-emerald-600">${totalRevenue.toLocaleString()}</div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900">No clients yet</h2>
          <p className="text-slate-500 mt-2">Clients are automatically created when you save proposals.</p>
          <Link
            href="/dashboard/proposals/new"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" />
            Create a Proposal
          </Link>
        </div>
      )}
    </div>
  );
}
