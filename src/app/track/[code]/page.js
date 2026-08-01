"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatusTracker from "@/components/StatusTracker";
import StatusBadge from "@/components/StatusBadge";
import ChatPanel from "@/components/ChatPanel";
import Icon from "@/components/Icon";
import { api } from "@/lib/client";
import { PACKAGE_TYPE_LABELS, REQUEST_STATUS } from "@/lib/constants";
import { formatDate } from "@/lib/format";

export default function TrackPage() {
  const { code } = useParams();

  const [req, setReq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-bg text-muted"><Icon name="search" className="h-8 w-8" /></div>
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
              <Row label="Payment method" value="Cash" />
              <Row label="Sender" value={req.senderName} />
              {req.courier && <Row label="Courier" value={<span className="inline-flex items-center gap-1">{req.courier.name} <Icon name="star" className="h-4 w-4 text-amber" fill="currentColor" /> {req.courier.rating || "—"}</span>} />}
              <Row label="Posted" value={formatDate(req.createdAt)} />
            </div>

            {/* Delivery PIN — owner only, while the parcel is still in flight */}
            {req.isOwner && req.deliveryPin && req.status !== REQUEST_STATUS.DELIVERED && (
              <div className="card mt-6 border-2 border-orange/40 text-center">
                <div className="text-sm font-semibold uppercase text-muted">Your delivery PIN</div>
                <div className="mono mt-2 text-4xl font-bold text-orange tracking-widest">{req.deliveryPin}</div>
                <p className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-danger">
                  <Icon name="lock" className="h-4 w-4" /> Share this PIN only with the person receiving the parcel. Do not share it with anyone else.
                </p>
              </div>
            )}

            {/* Timeline */}
            {req.matchedCourier && (
              <div className="card mt-6">
                <h3 className="mb-3 font-bold text-navy">Timeline</h3>
                <ul className="space-y-2 text-sm text-muted">
                  <TL label="Accepted" date={req.matchedCourier.acceptedAt} />
                  <TL label="Collected" date={req.matchedCourier.collectedAt} />
                  <TL label="Delivered" date={req.matchedCourier.deliveredAt} />
                  <TL label="PIN verified" date={req.matchedCourier.deliveryVerifiedAt} />
                </ul>
              </div>
            )}

            {/* In-app chat — only for the account-holding sender, once matched */}
            {req.matchedCourier && req.courier && req.isOwner && (
              <div className="mt-6">
                <h3 className="mb-2 font-bold text-navy">Chat with {req.courier.name}</h3>
                <ChatPanel requestId={req.id} />
              </div>
            )}

            {/* Review */}
            {req.status === REQUEST_STATUS.DELIVERED && !req.review && !reviewDone && (
              <div className="card mt-6">
                <h3 className="font-bold text-navy">Rate your courier</h3>
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
            <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted"><Icon name="lock" className="h-3.5 w-3.5" /> No phone numbers are ever shown on this page.</p>
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
      <span className={`inline-flex items-center gap-1.5 ${date ? "font-semibold text-navy" : ""}`}>
        {date ? <Icon name="check" className="h-4 w-4 text-success" strokeWidth={3} /> : <span className="inline-block h-3 w-3 rounded-full border border-border" />}
        {label}
      </span>
      <span>{date ? formatDate(date) : "—"}</span>
    </li>
  );
}
