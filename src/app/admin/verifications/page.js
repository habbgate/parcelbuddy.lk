"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import { api } from "@/lib/client";
import { formatDate } from "@/lib/format";

export default function AdminVerifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/api/admin/verifications").then((d) => setItems(d.verifications)).finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell>
      <h1 className="text-3xl font-extrabold text-navy">ID Verification Queue</h1>
      <p className="mt-1 text-muted">Review pending traveler identity documents.</p>

      {loading ? (
        <div className="py-16 text-center text-muted">Loading…</div>
      ) : items.length ? (
        <div className="mt-6 space-y-3">
          {items.map((v) => (
            <Link key={v.id} href={`/admin/verifications/${v.id}`} className="card flex items-center justify-between transition hover:shadow-md">
              <div>
                <div className="font-bold text-navy">{v.name}</div>
                <div className="text-sm text-muted">{v.email} · {v.phone}</div>
              </div>
              <div className="text-right text-sm">
                <div className="font-semibold text-navy">{v.docType}</div>
                <div className="text-muted">{formatDate(v.submittedAt)}</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card mt-6 text-center text-muted">🎉 No pending reviews. All caught up.</div>
      )}
    </AdminShell>
  );
}
