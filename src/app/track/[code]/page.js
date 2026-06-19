"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatusTracker from "@/components/StatusTracker";
import StatusBadge from "@/components/StatusBadge";
import ChatPanel from "@/components/ChatPanel";
import { api } from "@/lib/client";
import { PACKAGE_TYPE_LABELS, REQUEST_STATUS } from "@/lib/constants";
import { formatDate } from "@/lib/format";

export default function TrackPage() {
  const { code } = useParams();
  const search = useSearchParams();
  const confirmToken = search.get("confirm");

  const [req, setReq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewDone, setReviewDone] = useState(false);

  async function load() {
    try {
      const d = await api(`/api/track/${code}`);
      setReq(d.request);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function confirmDelivery() {
    setConfirming(true);
    setError("");
    try {
      await api(`/api/requests/${code}/confirm`, {
        method: "POST",
        body: { token: confirmToken },
      });
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setConfirming(false);
    }
  }

  async function submitReview() {
    try {
      await api(`/api/requests/${req.id}/review`, {
        method: "POST",
        body: { rating, comment },
      });
      setReviewDone(true);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10">
        {loading ? (
          <div className="py-20 text-center text-muted">Loading…</div>
        ) : error && !req ? (
          <div className="card text-center">
            <div className="text-4xl">🔍</div>
            <h1 className="mt-3 text-xl font-bold text-navy">Not found</h1>
            <p className="mt-1 text-muted">{error}</p>
            <Link href="/" className="btn-primary mt-5">Go home</Link>
          </div>
        ) : req ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <div className="mono text-2xl font-bold text-orange">{req.trackingCode}</div>
                <div className="mt-1 text-lg font-bold text-navy">
                  {req.route.fromCity} → {req.route.toCity}
                </div>
              </div>
              <StatusBadge status={req.status} />
            </div>

            <div className="card mt-6">
              <StatusTracker status={req.status} />
            </div>

            <div className="card mt-6 space-y-2 text-sm">
              <Row label="Item" value={`${PACKAGE_TYPE_LABELS[req.parcel.packageType]} · ${req.parcel.weightKg} kg · ${req.parcel.description}`} />
              <Row label="Reward" value={<span className="mono font-bold text-success">LKR {req.rewardLKR.toLocaleString()}</span>} />
              <Row label="Sender" value={req.senderName} />
              {req.traveler && <Row label="Traveler" value={`${req.traveler.name} ⭐ ${req.traveler.rating || "—"}`} />}
              <Row label="Posted" value={formatDate(req.createdAt)} />
            </div>

            {/* Timeline */}
            {req.matchedTraveler && (
              <div className="card mt-6">
                <h3 className="mb-3 font-bold text-navy">Timeline</h3>
                <ul className="space-y-2 text-sm text-muted">
                  <TL label="Accepted" date={req.matchedTraveler.acceptedAt} />
                  <TL label="Collected" date={req.matchedTraveler.collectedAt} />
                  <TL label="Delivered" date={req.matchedTraveler.deliveredAt} />
                  <TL label="Confirmed" date={req.matchedTraveler.confirmedAt} />
                </ul>
              </div>
            )}

            {/* In-app chat — only for the account-holding sender, once matched */}
            {req.matchedTraveler && req.traveler && req.isOwner && (
              <div className="mt-6">
                <h3 className="mb-2 font-bold text-navy">Chat with {req.traveler.name}</h3>
                <ChatPanel requestId={req.id} />
              </div>
            )}

            {/* Confirm delivery */}
            {req.status === REQUEST_STATUS.DELIVERED && confirmToken && (
              <div className="card mt-6 border-2 border-success bg-success/5 text-center">
                <h3 className="font-bold text-navy">Did you receive your parcel?</h3>
                <p className="mt-1 text-sm text-muted">Confirm to release payment to your traveler.</p>
                <button onClick={confirmDelivery} disabled={confirming} className="btn-success mt-4">
                  {confirming ? "Confirming…" : "✅ Confirm Delivery"}
                </button>
              </div>
            )}

            {/* Review */}
            {req.status === REQUEST_STATUS.COMPLETED && !req.review && !reviewDone && (
              <div className="card mt-6">
                <h3 className="font-bold text-navy">Rate your traveler</h3>
                <div className="mt-2 flex gap-1 text-3xl">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setRating(s)} className={s <= rating ? "text-amber" : "text-border"}>★</button>
                  ))}
                </div>
                <textarea className="input mt-3" rows={3} placeholder="Optional comment" value={comment} onChange={(e) => setComment(e.target.value)} />
                <button onClick={submitReview} disabled={!rating} className="btn-primary mt-3">Submit review</button>
              </div>
            )}

            {req.review && (
              <div className="card mt-6">
                <h3 className="font-bold text-navy">Your review</h3>
                <div className="mt-1 text-amber">{"★".repeat(req.review.rating)}{"☆".repeat(5 - req.review.rating)}</div>
                {req.review.comment && <p className="mt-1 text-sm text-muted">{req.review.comment}</p>}
              </div>
            )}

            {(req.status === REQUEST_STATUS.EXPIRED) && (
              <div className="card mt-6 text-center">
                <p className="text-muted">This request expired.</p>
                <Link href="/send" className="btn-primary mt-3">Post this again?</Link>
              </div>
            )}

            {error && <p className="mt-4 text-center text-sm text-danger">{error}</p>}
            <p className="mt-6 text-center text-xs text-muted">🔒 No phone numbers are ever shown on this page.</p>
          </>
        ) : null}
      </main>
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

function TL({ label, date }) {
  return (
    <li className="flex justify-between">
      <span className={date ? "font-semibold text-navy" : ""}>{date ? "✓" : "○"} {label}</span>
      <span>{date ? formatDate(date) : "—"}</span>
    </li>
  );
}
