"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import { api } from "@/lib/client";
import { formatLKR } from "@/lib/format";
import { STATUS_LABELS } from "@/lib/constants";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api("/api/admin/stats").then(setStats).catch(() => {});
  }, []);

  return (
    <AdminShell>
      <h1 className="text-3xl font-extrabold text-navy">Admin Dashboard</h1>

      {!stats ? (
        <div className="py-16 text-center text-muted">Loading metrics…</div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Pending ID Reviews" value={stats.kpis.pendingReviews} href="/admin/verifications" accent="text-amber" />
            <Kpi label="Open Requests" value={stats.kpis.openRequests} href="/admin/requests" accent="text-navy" />
            <Kpi label="Active Travelers" value={stats.kpis.activeTravelers} href="/admin/travelers" accent="text-success" />
            <Kpi label="Open Disputes" value={stats.kpis.openDisputes} href="/admin/disputes" accent="text-danger" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="card bg-navy text-white">
              <div className="text-sm uppercase text-white/70">Platform revenue this month</div>
              <div className="mono mt-2 text-4xl font-bold text-orange">{formatLKR(stats.kpis.revenueThisMonth)}</div>
              <p className="mt-1 text-sm text-white/60">From commission on completed deliveries.</p>
            </div>

            <div className="card">
              <h3 className="mb-3 font-bold text-navy">Status breakdown</h3>
              <div className="space-y-2">
                {Object.entries(stats.statusBreakdown).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between text-sm">
                    <span className="text-muted">{STATUS_LABELS[status] || status}</span>
                    <span className="font-bold text-navy">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Requests per day chart (simple bars) */}
          <div className="card mt-6">
            <h3 className="mb-4 font-bold text-navy">Requests (last 14 days)</h3>
            <RequestsChart data={stats.requestsPerDay} />
          </div>
        </>
      )}
    </AdminShell>
  );
}

function Kpi({ label, value, href, accent }) {
  return (
    <Link href={href} className="card transition hover:shadow-md">
      <div className="text-xs uppercase text-muted">{label}</div>
      <div className={`mt-1 text-3xl font-extrabold ${accent}`}>{value}</div>
    </Link>
  );
}

function RequestsChart({ data }) {
  if (!data?.length) return <p className="text-muted">No data yet.</p>;
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex h-40 items-end gap-1">
      {data.map((d) => (
        <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
          <div className="w-full rounded-t bg-orange" style={{ height: `${(d.count / max) * 100}%` }} title={`${d.date}: ${d.count}`} />
          <span className="text-[9px] text-muted">{d.date.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

