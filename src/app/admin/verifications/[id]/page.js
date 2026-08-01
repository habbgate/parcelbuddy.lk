"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { api } from "@/lib/client";
import { formatDate } from "@/lib/format";

export default function AdminVerificationDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [t, setT] = useState(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/api/admin/verifications/${id}`).then((d) => setT(d.courier)).catch((e) => setError(e.message));
  }, [id]);

  async function approve() {
    setBusy(true);
    try {
      await api(`/api/admin/verifications/${id}/approve`, { method: "POST" });
      router.push("/admin/verifications");
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }

  async function reject() {
    if (!reason.trim()) return setError("Provide a rejection reason");
    setBusy(true);
    try {
      await api(`/api/admin/verifications/${id}/reject`, { method: "POST", body: { reason } });
      router.push("/admin/verifications");
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }

  if (!t) return <AdminShell><div className="py-16 text-center text-muted">{error || "Loading…"}</div></AdminShell>;

  const v = t.idVerification || {};

  return (
    <AdminShell>
      <h1 className="text-2xl font-extrabold text-navy">Review: {t.name}</h1>
      <div className="mt-2 text-sm text-muted">{t.email} · {t.phone} · Member since {formatDate(t.memberSince)}</div>

      <div className="card mt-6">
        <div className="mb-3 font-bold text-navy">Document: {v.docType}</div>
        <div className="grid gap-4 sm:grid-cols-3">
          <DocImg label="Front" url={v.frontUrl} />
          <DocImg label="Back" url={v.backUrl} />
          <DocImg label="Selfie" url={v.selfieUrl} />
        </div>
      </div>

      <div className="card mt-6">
        <label className="label">Rejection reason (required to reject)</label>
        <textarea className="input" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Document image is blurry" />
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        <div className="mt-4 flex gap-3">
          <button onClick={approve} disabled={busy} className="btn-success">✅ Approve</button>
          <button onClick={reject} disabled={busy} className="btn-danger">❌ Reject</button>
        </div>
      </div>
    </AdminShell>
  );
}

function DocImg({ label, url }) {
  return (
    <div>
      <div className="mb-1 text-xs font-semibold uppercase text-muted">{label}</div>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img src={url} alt={label} className="h-40 w-full rounded-lg border border-border object-cover" />
        </a>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted">Not provided</div>
      )}
    </div>
  );
}
