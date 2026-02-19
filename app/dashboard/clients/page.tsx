import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users, Plus, Mail, Building, FileText, Search } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: clients } = await supabase
    .from("clients")
    .select("*, proposals(id, status, total_amount, currency)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
          <p className="text-slate-500 mt-1">{clients?.length || 0} total clients</p>
        </div>
      </div>

      {clients && clients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client: any) => {
            const acceptedProposals = client.proposals?.filter((p: any) => p.status === "accepted") || [];
            const totalRevenue = acceptedProposals.reduce((sum: number, p: any) => sum + (p.total_amount || 0), 0);
            const proposalCount = client.proposals?.length || 0;
            const lastProposal = client.proposals?.[0];

            return (
              <Link
                key={client.id}
                href={`/dashboard/clients/${client.id}`}
                className="group bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:shadow-slate-100 hover:border-slate-200 transition-all duration-200 block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="text-lg font-bold text-emerald-700">
                      {client.name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  </div>
                  {acceptedProposals.length > 0 && (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                      ${totalRevenue.toLocaleString()}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">{client.name}</h3>
                {client.company && (
                  <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                    <Building className="w-3 h-3" /> {client.company}
                  </p>
                )}
                {client.email && (
                  <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                    <Mail className="w-3 h-3" /> {client.email}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-300" />
                    <span className="text-xs text-slate-400">{proposalCount} proposal{proposalCount !== 1 ? "s" : ""}</span>
                  </div>
                  {lastProposal && (
                    <span className="text-xs text-slate-300">
                      Last: {new Date(lastProposal.created_at || client.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Users className="w-10 h-10 text-slate-200" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">No clients yet</h2>
          <p className="text-slate-400 mt-2 max-w-xs mx-auto">
            Clients are automatically created when you save a proposal. Create your first one!
          </p>
          <Link
            href="/dashboard/proposals/new"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors hover:shadow-lg hover:shadow-emerald-200"
          >
            <Plus className="w-4 h-4" />
            Create a Proposal
          </Link>
        </div>
      )}
    </div>
  );
}
