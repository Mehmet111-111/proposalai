"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  DollarSign,
  Users,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { getCurrencySymbol } from "@/lib/currency";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  BarChart,
  Bar,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  draft: "#94a3b8",
  sent: "#3b82f6",
  viewed: "#f59e0b",
  accepted: "#10b981",
  rejected: "#ef4444",
  expired: "#6b7280",
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [propRes, invRes, clientRes] = await Promise.all([
      supabase.from("proposals").select("*").eq("user_id", user.id),
      supabase.from("invoices").select("*").eq("user_id", user.id),
      supabase.from("clients").select("*").eq("user_id", user.id),
    ]);

    setProposals(propRes.data || []);
    setInvoices(invRes.data || []);
    setClients(clientRes.data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  const totalProposals = proposals.length;
  const accepted = proposals.filter((p) => p.status === "accepted").length;
  const rejected = proposals.filter((p) => p.status === "rejected").length;
  const pending = proposals.filter((p) => ["sent", "viewed"].includes(p.status)).length;
  const acceptanceRate = totalProposals > 0 ? Math.round((accepted / totalProposals) * 100) : 0;
  const totalRevenue = proposals
    .filter((p) => p.status === "accepted")
    .reduce((sum, p) => sum + (p.total_amount || 0), 0);
  const avgDealSize = accepted > 0 ? Math.round(totalRevenue / accepted) : 0;
  const primaryCurrency = proposals.find(p => p.currency)?.currency || "USD";
  const currSymbol = getCurrencySymbol(primaryCurrency);

  // Status distribution for pie chart
  const statusData = Object.entries(
    proposals.reduce((acc: Record<string, number>, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: STATUS_COLORS[name],
  }));

  // Monthly revenue (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const month = date.toLocaleString("en", { month: "short" });
    const year = date.getFullYear();
    const monthStart = new Date(year, date.getMonth(), 1);
    const monthEnd = new Date(year, date.getMonth() + 1, 0);

    const revenue = proposals
      .filter((p) => {
        const d = new Date(p.created_at);
        return p.status === "accepted" && d >= monthStart && d <= monthEnd;
      })
      .reduce((sum, p) => sum + (p.total_amount || 0), 0);

    const count = proposals.filter((p) => {
      const d = new Date(p.created_at);
      return d >= monthStart && d <= monthEnd;
    }).length;

    return { month, revenue, proposals: count };
  });

  // Weekly proposals (last 8 weeks)
  const weeklyData = Array.from({ length: 8 }, (_, i) => {
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() - (7 - i) * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 7);

    const count = proposals.filter((p) => {
      const d = new Date(p.created_at);
      return d >= weekStart && d <= weekEnd;
    }).length;

    return { week: `W${i + 1}`, proposals: count };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 mt-1">Track your proposal performance and revenue</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm text-slate-500">Total Proposals</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalProposals}</p>
          <p className="text-xs text-slate-400 mt-1">{pending} pending</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-sm text-slate-500">Acceptance Rate</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{acceptanceRate}%</p>
          <p className="text-xs text-slate-400 mt-1">{accepted} accepted, {rejected} rejected</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <DollarSign className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-sm text-slate-500">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{currSymbol}{totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">Avg {currSymbol}{avgDealSize.toLocaleString()}/deal</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Users className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-sm text-slate-500">Total Clients</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{clients.length}</p>
          <p className="text-xs text-slate-400 mt-1">{invoices.length} invoices</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Monthly Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} tickFormatter={(v) => `${currSymbol}${v}`} />
                <Tooltip
                  formatter={(value: number) => [`${currSymbol}${value.toLocaleString()}`, "Revenue"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
                />
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Proposal Status</h3>
          {statusData.length > 0 ? (
            <div className="h-64 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 justify-center">
                {statusData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-xs text-slate-500">{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-sm text-slate-400">No proposals yet</div>
          )}
        </div>
      </div>

      {/* Proposals Trend */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Proposals Created (Last 8 Weeks)</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Bar dataKey="proposals" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
