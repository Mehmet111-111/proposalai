import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Bell, Eye, CheckCircle, XCircle, DollarSign, Clock } from "lucide-react";
import Link from "next/link";

const typeIcons: Record<string, any> = {
  proposal_viewed: Eye,
  proposal_accepted: CheckCircle,
  proposal_rejected: XCircle,
  invoice_paid: DollarSign,
  invoice_overdue: Clock,
};

const typeColors: Record<string, string> = {
  proposal_viewed: "bg-blue-100 text-blue-600",
  proposal_accepted: "bg-emerald-100 text-emerald-600",
  proposal_rejected: "bg-red-100 text-red-600",
  invoice_paid: "bg-emerald-100 text-emerald-600",
  invoice_overdue: "bg-amber-100 text-amber-600",
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  // Mark all as read
  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="text-slate-500 mt-1">Stay updated on your proposals and invoices</p>
      </div>

      {notifications && notifications.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {notifications.map((notif: any) => {
            const Icon = typeIcons[notif.type] || Bell;
            const color = typeColors[notif.type] || "bg-slate-100 text-slate-600";
            return (
              <div key={notif.id} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{notif.title}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{notif.message}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
                {notif.link && (
                  <Link href={notif.link} className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium flex-shrink-0">
                    View
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900">No notifications yet</h2>
          <p className="text-slate-500 mt-2">You&apos;ll be notified when clients view or respond to your proposals.</p>
        </div>
      )}
    </div>
  );
}
