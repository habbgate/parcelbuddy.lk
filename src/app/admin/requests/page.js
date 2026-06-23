"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/AdminShell";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/client";
import { REQUEST_STATUS } from "@/lib/constants";
import { formatLKR, formatDate } from "@/lib/format";

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const qs = status ? `?status=${status}` : "";
    const d = await api(`/api/admin/requests${qs}`);
    setRequests(d.requests);
    setLoading(false);
  }, [status]);

  useEffect(() => { load(); }, [load]);

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-navy">All Requests</h1>
        <select className="input max-w-xs" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {Object.values(REQUEST_STATUS).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="py-16 text-center text-muted">Loading…</div>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-muted">
              <tr className="border-b border-border">
                <th className="py-2">Code</th><th>Route</th><th>Sender</th><th>Reward</th><th>Status</th><th>Posted</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="py-2 mono font-semibold">{r.trackingCode}</td>
                  <td>{r.route.fromCity} → {r.route.toCity}</td>
                  <td>{r.sender.name}<br /><span className="text-xs text-muted">{r.sender.phone}</span></td>
                  <td className="mono">{formatLKR(r.rewardLKR)}</td>
                  <td><StatusBadge status={r.status} />{r.dispute && <span className="badge badge-red ml-1">⚠️</span>}</td>
                  <td className="text-xs text-muted">{formatDate(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}

