"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/AdminShell";
import { api } from "@/lib/client";
import { USER_STATUS } from "@/lib/constants";
import { formatLKR } from "@/lib/format";

export default function AdminTravelers() {
  const [travelers, setTravelers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const d = await api(`/api/admin/travelers?page=${page}`);
    setTravelers(d.travelers);
    setPagination(d.pagination);
    setLoading(false);
  }, [page]);

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
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-1">{t.name}<br /><span className="text-xs text-muted">{t.email}</span></td>
                  <td><span className="badge badge-gray">{t.status}</span></td>
                  <td className="text-xs">{t.idStatus}</td>
                  <td>{t.totalDeliveries}</td>
                  <td>{t.averageRating || "—"}</td>
                  <td className="mono">{formatLKR(t.walletBalance)}</td>
                  <td>
                    <div className="flex gap-2">
                      {t.status !== USER_STATUS.SUSPENDED && <button onClick={() => setStatus(t.id, USER_STATUS.SUSPENDED)} className="text-xs font-semibold text-amber hover:underline">Suspend</button>}
                      {t.status !== USER_STATUS.BANNED && <button onClick={() => setStatus(t.id, USER_STATUS.BANNED)} className="text-xs font-semibold text-danger hover:underline">Ban</button>}
                      {(t.status === USER_STATUS.SUSPENDED || t.status === USER_STATUS.BANNED) && <button onClick={() => setStatus(t.id, USER_STATUS.ACTIVE)} className="text-xs font-semibold text-success hover:underline">Reactivate</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm text-slate-500">
                Showing page {page} of {pagination.totalPages} ({pagination.totalCount} total)
              </span>
              <div className="flex gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button 
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}

