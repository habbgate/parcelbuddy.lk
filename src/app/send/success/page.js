"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";

function SuccessInner() {
  const params = useSearchParams();
  const code = params.get("code") || "PB-XXXX";
  const [copied, setCopied] = useState(false);

  const base = typeof window !== "undefined" ? window.location.origin : "https://parcelbuddy.lk";
  const trackUrl = `${base}/track/${code}`;
  const waMessage = encodeURIComponent(
    `I'm looking for someone to carry a parcel. Track & details: ${trackUrl}`
  );

  function copy(text) {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success">
        <Icon name="check-circle" className="h-10 w-10" />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold text-navy">Your request is LIVE!</h1>
      <p className="mt-2 text-muted">Verified travelers on your route can now see it.</p>

      <div className="card mt-8">
        <div className="text-sm font-semibold uppercase text-muted">Your tracking code</div>
        <div className="mono mt-2 text-4xl font-bold text-orange">{code}</div>
        <button onClick={() => copy(code)} className="btn-outline mt-4 text-sm">
          {copied ? "Copied!" : "Copy code"}
        </button>

        <div className="mt-4 rounded-lg bg-bg px-4 py-3 text-sm text-muted">
          Track at: <span className="font-semibold text-navy">{trackUrl}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href={`https://wa.me/?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-success"
        >
          <Icon name="share" className="h-5 w-5" /> Share on WhatsApp
        </a>
        <button onClick={() => copy(trackUrl)} className="btn-outline">
          <Icon name="link" className="h-5 w-5" /> Copy tracking link
        </button>
        <Link href={`/track/${code}`} className="btn-navy">
          Track this parcel
        </Link>
      </div>

      <p className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-success/10 px-4 py-3 text-sm text-success">
        <Icon name="lock" className="h-4 w-4" /> Your phone is hidden. It&apos;s only shared when a verified traveler accepts.
      </p>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="py-20 text-center text-muted">Loading…</div>}>
        <SuccessInner />
      </Suspense>
      <Footer />
    </>
  );
}

