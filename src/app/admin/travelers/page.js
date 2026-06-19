"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/AdminShell";
import { api } from "@/lib/client";
import { USER_STATUS } from "@/lib/constants";
import { formatLKR } from "@/lib/format";

export default function AdminTravelers() {
  const [travelers, setTravelers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const d = await api("/api/admin/travelers");
    setTravelers(d.travelers);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function setStatus(id, status) {
    if (!confirm(`Set this traveler to ${status}?`)) return;
    await api(`/api/admin/travelers/${id}/status`, { method: "PATCH", body: { status } });
    load();
  }

  return (
    <AdminShell>
      <h1 className="text-3xl font-extrabold text-navy">Travelers</h1>
      {loading ? (
        <div className="py-16 text-center text-muted">Loading…</div>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-muted">
              <tr className="border-b border-border">
                <th className="py-2">Name</th><th>Status</th><th>ID</th><th>Deliveries</th><th>Rating</th><th>Wallet</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {travelers.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0">
                  <td className="py-2">{t.name}<br /><span className="text-xs text-muted">{t.email}</span></td>
                  <td><span className="badge badge-gray">{t.status}</span></td>
                  <td className="text-xs">{t.idStatus}</td>
                  <td>{t.totalDeliveries}</td>
                  <td>{t.averageRating || "—"}</td>
                  <td className="mono">{formatLKR(t.walletBalance)}</td>
                  <td>
                    <div className="flex gap-1">
                      {t.status !== USER_STATUS.SUSPENDED && <button onClick={() => setStatus(t.id, USER_STATUS.SUSPENDED)} className="text-xs font-semibold text-amber">Suspend</button>}
                      {t.status !== USER_STATUS.BANNED && <button onClick={() => setStatus(t.id, USER_STATUS.BANNED)} className="text-xs font-semibold text-danger">Ban</button>}
                      {(t.status === USER_STATUS.SUSPENDED || t.status === USER_STATUS.BANNED) && <button onClick={() => setStatus(t.id, USER_STATUS.ACTIVE)} className="text-xs font-semibold text-success">Reactivate</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
