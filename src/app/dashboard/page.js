"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import StatusTracker from "@/components/StatusTracker";
import { api } from "@/lib/client";
import { REQUEST_STATUS } from "@/lib/constants";
import { formatLKR } from "@/lib/format";
import Icon from "@/components/Icon";

export default function DashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [actives, setActives] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [sent, setSent] = useState([]);
  const [busy, setBusy] = useState(false);

  async function loadAll() {
    const [u, jobs, n, s] = await Promise.all([
      api("/api/users/me"),
      api("/api/users/me/jobs"),
      api("/api/users/me/notifications"),
      api("/api/users/me/sent-parcels"),
    ]);
    setMe(u.user);
    setActives(jobs.actives || []);
    setNotifs(n.notifications.slice(0, 5));
    setSent(s.parcels);
  }

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/auth/login?callbackUrl=/dashboard");
    if (authStatus === "authenticated") loadAll().catch(() => {});
  }, [authStatus, router]);

  async function toggleAvailable() {
    const next = !me.isAvailable;
    setMe((m) => ({ ...m, isAvailable: next }));
    await api("/api/users/me", { method: "PUT", body: { isAvailable: next } });
  }

  async function updateStatus(jobId, action) {
    setBusy(true);
    try {
      const method = action === "cancel" ? "POST" : "PATCH";
      await api(`/api/requests/${jobId}/${action}`, { method });
      await loadAll();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!me) return <><Navbar /><div className="py-20 text-center text-muted">Loading dashboard…</div></>;

  const pending = me.status === "PENDING_VERIFICATION";

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-extrabold text-navy">Hi, {me.name.split(" ")[0]}</h1>
          <label className="flex items-center gap-2 text-sm font-semibold text-navy">
            <span>I&apos;m available for jobs</span>
            <button onClick={toggleAvailable} className={`relative h-7 w-12 rounded-full transition ${me.isAvailable ? "bg-success" : "bg-border"}`}>
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${me.isAvailable ? "left-6" : "left-1"}`} />
            </button>
          </label>
        </div>

        {pending && (
          <div className="card mt-6 border-2 border-amber bg-amber/10">
            <h3 className="font-bold text-navy">Complete your verification</h3>
            <p className="mt-1 text-sm text-muted">You can browse jobs, but you must verify your identity before accepting one.</p>
            <Link href="/verify-identity" className="btn-primary mt-3">Verify identity →</Link>
          </div>
        )}

        {/* Quick actions */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/send" className="card flex items-center gap-4 transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <Icon name="box" className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-navy">Send a Parcel</div>
              <div className="text-sm text-muted">Post a request — we&apos;ll pre-fill your details.</div>
            </div>
          </Link>
          <Link href="/parcels" className="card flex items-center gap-4 transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <Icon name="briefcase" className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-navy">Find a Job</div>
              <div className="text-sm text-muted">Browse parcels heading your way.</div>
            </div>
          </Link>
        </div>

        {/* Active jobs */}
        <div className="mt-6">
          <h2 className="mb-3 text-lg font-bold text-navy">
            Active jobs {actives.length > 0 && <span className="text-muted">({actives.length})</span>}
          </h2>
          {actives.length ? (
            <div className="space-y-4">
              {actives.map((job) => (
                <div key={job.id} className="card">
                  <div className="flex items-center justify-between">
                    <div className="font-extrabold text-navy">{job.route.fromCity} → {job.route.toCity}</div>
                    <StatusBadge status={job.status} />
                  </div>
                  <div className="my-4"><StatusTracker status={job.status} /></div>
                  <div className="text-sm text-muted">
                    {job.parcel.description} · Reward {formatLKR(job.rewardLKR)} · Cash
                  </div>
                  {job.sender?.phone && (
                    <div className="mt-2 text-sm">Sender: <span className="font-semibold text-navy">{job.sender.name}</span> · <a href={`tel:${job.sender.phone}`} className="mono text-success">{job.sender.phone}</a></div>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.status === REQUEST_STATUS.MATCHED && (
                      <>
                        <button onClick={() => updateStatus(job.id, "collected")} disabled={busy} className="btn-primary">Mark Collected</button>
                        <button onClick={() => updateStatus(job.id, "cancel")} disabled={busy} className="btn-outline">Cancel</button>
                      </>
                    )}
                    {job.status === REQUEST_STATUS.COLLECTED && (
                      <button onClick={() => updateStatus(job.id, "transit")} disabled={busy} className="btn-navy">Mark In Transit</button>
                    )}
                    {(job.status === REQUEST_STATUS.COLLECTED || job.status === REQUEST_STATUS.IN_TRANSIT) && (
                      <span className="text-sm text-muted">Enter the delivery PIN in job details to complete →</span>
                    )}
                    <Link href={`/jobs/${job.id}`} className="btn-navy">Open chat & details →</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center text-muted">
              No active jobs. <Link href="/parcels" className="font-semibold text-orange">Find one →</Link>
            </div>
          )}
        </div>

        {/* Stats + earnings */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard label="Completed Deliveries" value={me.stats.totalDeliveries} />
          <StatCard label="Avg Rating" value={me.stats.averageRating ? `${me.stats.averageRating} / 5.0` : "—"} />
          <div className="card bg-navy text-white">
            <div className="text-xs uppercase text-white/70">Earnings (Cash)</div>
            <div className="mono mt-1 text-2xl font-bold text-orange">{formatLKR(me.stats.totalEarningsLKR)}</div>
            <div className="mt-1 text-xs text-white/60">Paid directly by senders — no platform fee.</div>
          </div>
        </div>

        {/* My sent parcels */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">My sent parcels</h2>
            <Link href="/send" className="text-sm font-semibold text-orange">Send another →</Link>
          </div>
          {sent.length ? (
            <div className="space-y-3">
              {sent.map((p) => (
                <Link key={p.id} href={`/track/${p.trackingCode}`} className="card flex items-center justify-between transition hover:shadow-md">
                  <div>
                    <div className="font-bold text-navy">{p.route.fromCity} → {p.route.toCity}</div>
                    <div className="text-sm text-muted">
                      <span className="mono">{p.trackingCode}</span> · {p.parcel.description} · {formatLKR(p.rewardLKR)}
                    </div>
                    {p.status !== REQUEST_STATUS.DELIVERED && p.deliveryPin && (
                      <div className="mt-1 text-xs font-semibold text-orange">PIN: <span className="mono">{p.deliveryPin}</span></div>
                    )}
                  </div>
                  <StatusBadge status={p.status} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="card text-center text-muted">
              You haven&apos;t sent any parcels yet. <Link href="/send" className="font-semibold text-orange">Send one →</Link>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">Recent notifications</h2>
            <Link href="/notifications" className="text-sm font-semibold text-orange">View all →</Link>
          </div>
          <div className="card divide-y divide-border">
            {notifs.length ? notifs.map((n) => (
              <Link key={n._id} href={n.link || "#"} className="block py-3 first:pt-0 last:pb-0">
                <div className="font-semibold text-navy">{n.title}</div>
                <div className="text-sm text-muted">{n.body}</div>
              </Link>
            )) : <p className="text-muted">No notifications yet.</p>}
          </div>
        </div>
      </main>
    </>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card">
      <div className="text-xs uppercase text-muted">{label}</div>
      <div className="mt-1 text-2xl font-bold text-navy">{value}</div>
    </div>
  );
}

