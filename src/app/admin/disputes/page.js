"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/AdminShell";
import { api } from "@/lib/client";
import { formatDate } from "@/lib/format";

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(null);
  const [resolution, setResolution] = useState("");

  const load = useCallback(async () => {
    const d = await api("/api/admin/disputes");
    setDisputes(d.disputes);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function resolve(id) {
    if (!resolution.trim()) return;
    await api(`/api/admin/disputes/${id}/resolve`, { method: "POST", body: { resolution } });
    setResolving(null);
    setResolution("");
    load();
  }

  return (
    <AdminShell>
      <h1 className="text-3xl font-extrabold text-navy">Disputes</h1>
      {loading ? (
        <div className="py-16 text-center text-muted">Loading…</div>
      ) : disputes.length ? (
        <div className="mt-6 space-y-3">
          {disputes.map((d) => (
            <div key={d.id} className="card">
              <div className="flex items-center justify-between">
                <div className="mono font-bold text-navy">{d.trackingCode}</div>
                <span className="text-sm text-muted">{d.route}</span>
              </div>
              <div className="mt-2 text-sm">
                <span className="font-semibold text-danger">{d.dispute.reason}</span> — reported by {d.dispute.reportedBy}
              </div>
              <p className="mt-1 text-sm text-muted">{d.dispute.description}</p>
              <p className="text-xs text-muted">{formatDate(d.dispute.createdAt)}</p>

              {resolving === d.id ? (
                <div className="mt-3">
                  <textarea className="input" rows={2} placeholder="Resolution note" value={resolution} onChange={(e) => setResolution(e.target.value)} />
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => resolve(d.id)} className="btn-success !py-2 text-sm">Resolve</button>
                    <button onClick={() => setResolving(null)} className="btn-ghost !py-2 text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setResolving(d.id)} className="btn-primary mt-3 !py-2 text-sm">Resolve dispute</button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card mt-6 text-center text-muted">No open disputes.</div>
      )}
    </AdminShell>
  );
}

