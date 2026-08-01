"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import StatusTracker from "@/components/StatusTracker";
import ChatPanel from "@/components/ChatPanel";
import { api } from "@/lib/client";
import { PACKAGE_TYPE_LABELS, REQUEST_STATUS } from "@/lib/constants";
import { formatLKR } from "@/lib/format";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { status: authStatus } = useSession();
  const [req, setReq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pin, setPin] = useState("");

  async function load() {
    const d = await api(`/api/requests/${id}`);
    setReq(d.request);
  }

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push(`/auth/login?callbackUrl=/jobs/${id}`);
    if (authStatus === "authenticated") load().catch((e) => setError(e.message)).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus]);

  async function action(act) {
    setBusy(true);
    setError("");
    try {
      const method = act === "cancel" ? "POST" : "PATCH";
      await api(`/api/requests/${id}/${act}`, { method });
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function verifyPin() {
    setBusy(true);
    setError("");
    try {
      await api(`/api/requests/${id}/delivered`, { method: "PATCH", body: { pin } });
      setPin("");
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <><Navbar /><div className="py-20 text-center text-muted">Loading…</div></>;
  if (!req) return <><Navbar /><div className="card mx-auto mt-10 max-w-md text-center">{error || "Not found"}</div></>;

  const s = req.status;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold text-navy">{req.route.fromCity} → {req.route.toCity}</div>
            <div className="mono text-sm text-muted">{req.trackingCode}</div>
          </div>
          <StatusBadge status={s} />
        </div>

        <div className="card mt-6"><StatusTracker status={s} /></div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="card space-y-2 text-sm">
              <h3 className="font-bold text-navy">Parcel details</h3>
              <Row label="Contents" value={req.parcel.description} />
              <Row label="Type" value={PACKAGE_TYPE_LABELS[req.parcel.packageType]} />
              <Row label="Weight" value={`${req.parcel.weightKg} kg`} />
              {req.parcel.specialNotes && <Row label="Notes" value={req.parcel.specialNotes} />}
              <Row label="Reward" value={<span className="mono font-bold text-success">{formatLKR(req.rewardLKR)}</span>} />
              <Row label="Payment method" value="Cash" />
            </div>

            {req.sender?.phone && (
              <div className="card">
                <h3 className="font-bold text-navy">Sender contact</h3>
                <p className="mt-2 font-semibold text-navy">{req.sender.name}</p>
                <a href={`tel:${req.sender.phone}`} className="mono text-lg font-bold text-success">{req.sender.phone}</a>
              </div>
            )}

            {/* Context-aware actions */}
            <div className="card">
              <h3 className="mb-3 font-bold text-navy">Update status</h3>
              <div className="flex flex-wrap gap-2">
                {s === REQUEST_STATUS.MATCHED && (
                  <>
                    <button onClick={() => action("collected")} disabled={busy} className="btn-primary">Mark Collected</button>
                    <button onClick={() => action("cancel")} disabled={busy} className="btn-outline">Cancel job</button>
                  </>
                )}
                {s === REQUEST_STATUS.COLLECTED && (
                  <button onClick={() => action("transit")} disabled={busy} className="btn-navy">Mark In Transit</button>
                )}
              </div>

              {(s === REQUEST_STATUS.COLLECTED || s === REQUEST_STATUS.IN_TRANSIT) && (
                <div className="mt-4 rounded-lg border border-border p-3">
                  <label className="label">Enter Delivery PIN</label>
                  <p className="mb-2 text-xs text-muted">Ask the recipient for their 4-digit PIN to confirm the handoff.</p>
                  <div className="flex gap-2">
                    <input
                      className="input mono w-32 text-center text-lg tracking-widest"
                      maxLength={4}
                      inputMode="numeric"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                      placeholder="0000"
                    />
                    <button onClick={verifyPin} disabled={busy || pin.length !== 4} className="btn-success">
                      Verify &amp; Complete Delivery
                    </button>
                  </div>
                </div>
              )}

              {s === REQUEST_STATUS.DELIVERED && <p className="mt-3 text-sm font-semibold text-success">✅ Delivered — cash earnings credited.</p>}
              {error && <p className="mt-3 text-sm text-danger">{error}</p>}
            </div>

            {s === REQUEST_STATUS.DELIVERED && req.review && (
              <div className="card">
                <h3 className="font-bold text-navy">Sender review</h3>
                <div className="mt-1 text-amber">{"★".repeat(req.review.rating)}{"☆".repeat(5 - req.review.rating)}</div>
                {req.review.comment && <p className="mt-1 text-sm text-muted">{req.review.comment}</p>}
              </div>
            )}
          </div>

          {/* Chat */}
          <div>
            <ChatPanel requestId={req.id} />
          </div>
        </div>
      </main>
    </>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-border py-1.5 last:border-0">
      <span className="text-muted">{label}</span>
      <span className="text-right font-semibold text-navy">{value}</span>
    </div>
  );
}
