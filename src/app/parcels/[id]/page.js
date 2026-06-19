"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/client";
import { PACKAGE_TYPE_LABELS, REQUEST_STATUS } from "@/lib/constants";
import { timeAgo } from "@/lib/format";

export default function ParcelDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();

  const [req, setReq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [agree, setAgree] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [revealed, setRevealed] = useState(null);
  const [error, setError] = useState("");

  const userStatus = session?.user?.status;
  const isActive = userStatus === "ACTIVE";
  const isLoggedIn = authStatus === "authenticated";

  useEffect(() => {
    api(`/api/requests/${id}`)
      .then((d) => setReq(d.request))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  function onAcceptClick() {
    if (!isLoggedIn) return router.push("/auth/login");
    if (!isActive) return router.push("/verify-identity");
    setShowModal(true);
  }

  async function confirmAccept() {
    setAccepting(true);
    setError("");
    try {
      const d = await api(`/api/requests/${id}/accept`, { method: "POST" });
      setRevealed(d.sender);
      setShowModal(false);
    } catch (e) {
      if (e.code === "VERIFICATION_REQUIRED") {
        router.push("/verify-identity");
        return;
      }
      setError(e.message);
    } finally {
      setAccepting(false);
    }
  }

  if (loading) return <Shell><div className="py-20 text-center text-muted">Loading…</div></Shell>;
  if (!req) return <Shell><div className="card text-center">{error || "Not found"}</div></Shell>;

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-extrabold text-navy">
            {req.route.fromCity} <span className="text-orange">→</span> {req.route.toCity}
          </div>
          <div className="mono text-sm text-muted">{req.trackingCode}</div>
        </div>
        <StatusBadge status={req.status} />
      </div>

      <div className="card mt-6 space-y-2 text-sm">
        <Row label="Contents" value={req.parcel.description} />
        <Row label="Type" value={PACKAGE_TYPE_LABELS[req.parcel.packageType]} />
        <Row label="Weight" value={`${req.parcel.weightKg} kg`} />
        {req.parcel.isFragile && <Row label="Handling" value={<span className="text-danger font-semibold">Fragile</span>} />}
        {req.parcel.specialNotes && <Row label="Notes" value={req.parcel.specialNotes} />}
        <Row label="Sender" value={req.senderName} />
        <Row label="Posted" value={timeAgo(req.createdAt)} />
      </div>

      {req.parcel.photos?.length > 0 && (
        <div className="mt-4 flex gap-2">
          {req.parcel.photos.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={p} alt="parcel" className="h-24 w-24 rounded-lg border border-border object-cover" />
          ))}
        </div>
      )}

      <div className="card mt-6 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase text-muted">Reward</div>
          <div className="mono text-3xl font-bold text-success">LKR {req.rewardLKR.toLocaleString()}</div>
        </div>

        {req.status === REQUEST_STATUS.OPEN ? (
          <div className="text-right">
            <button onClick={onAcceptClick} className="btn-primary">
              {isLoggedIn && !isActive ? "🔒 Verify to Accept" : "Accept Job →"}
            </button>
            {isLoggedIn && !isActive && (
              <p className="mt-1 text-xs text-muted">Complete your verification to accept jobs</p>
            )}
          </div>
        ) : (
          <span className="text-sm font-semibold text-muted">No longer open</span>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      {/* Revealed contact after accept */}
      {revealed && (
        <div className="card mt-6 border-2 border-success bg-success/5">
          <h3 className="font-bold text-navy">✅ Job accepted! Sender contact</h3>
          <p className="mt-2 text-lg font-bold text-navy">{revealed.name}</p>
          <a href={`tel:${revealed.phone}`} className="mono text-xl font-bold text-success">{revealed.phone}</a>
          <div className="mt-4 flex gap-3">
            <Link href={`/jobs/${req.id}`} className="btn-primary">Go to job →</Link>
            <a href={`https://wa.me/${revealed.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="btn-success">WhatsApp</a>
          </div>
        </div>
      )}

      {/* Accept modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <h3 className="text-xl font-extrabold text-navy">Accept this job?</h3>
            <div className="mt-4 space-y-1 rounded-lg bg-bg p-4 text-sm">
              <Row label="Route" value={`${req.route.fromCity} → ${req.route.toCity}`} />
              <Row label="Item" value={req.parcel.description} />
              <Row label="Reward" value={<span className="mono font-bold text-success">LKR {req.rewardLKR.toLocaleString()}</span>} />
            </div>
            <p className="mt-3 text-sm text-muted">🔒 The sender&apos;s phone will be revealed after you confirm.</p>
            <label className="mt-4 flex items-start gap-2 text-sm font-semibold text-navy">
              <input type="checkbox" className="mt-0.5 h-5 w-5 accent-orange" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              I will responsibly collect and deliver this parcel.
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" disabled={!agree || accepting} onClick={confirmAccept}>
                {accepting ? "Accepting…" : "Yes, Accept Job →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10">{children}</main>
      <Footer />
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
