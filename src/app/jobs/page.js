"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/client";
import { formatLKR, timeAgo } from "@/lib/format";

export default function JobsPage() {
  const { status: authStatus } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/auth/login?callbackUrl=/jobs");
    if (authStatus === "authenticated") {
      api("/api/users/me/jobs").then((d) => setJobs(d.jobs)).finally(() => setLoading(false));
    }
  }, [authStatus, router]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-extrabold text-navy">My Jobs</h1>
        {loading ? (
          <div className="py-16 text-center text-muted">Loading…</div>
        ) : jobs.length ? (
          <div className="mt-6 space-y-3">
            {jobs.map((j) => (
              <Link key={j.id} href={`/jobs/${j.id}`} className="card flex items-center justify-between transition hover:shadow-md">
                <div>
                  <div className="font-bold text-navy">{j.route.fromCity} → {j.route.toCity}</div>
                  <div className="text-sm text-muted">{j.parcel.description} · {timeAgo(j.createdAt)}</div>
                </div>
                <div className="text-right">
                  <StatusBadge status={j.status} />
                  <div className="mono mt-1 text-sm font-bold text-success">{formatLKR(j.payoutLKR)}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card mt-6 text-center text-muted">
            No jobs yet. <Link href="/parcels" className="font-semibold text-orange">Browse open jobs →</Link>
          </div>
        )}
      </main>
    </>
  );
}

