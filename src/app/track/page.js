"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";

// Normalize user input into a PB-XXXX tracking code.
function normalizeCode(raw) {
  let c = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (!c) return "";
  // Allow entering just the 4-char suffix or the full code.
  if (!c.startsWith("PB-")) {
    c = c.startsWith("PB") ? `PB-${c.slice(2)}` : `PB-${c}`;
  }
  return c;
}

export default function TrackLandingPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    setError("");
    const normalized = normalizeCode(code);
    // Expect PB- followed by 4 allowed characters.
    if (!/^PB-[A-Z0-9]{4,}$/.test(normalized)) {
      setError("Enter a valid tracking code, e.g. PB-8X4K");
      return;
    }
    router.push(`/track/${normalized}`);
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-16">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange/10 text-orange"><Icon name="search" className="h-8 w-8" /></div>
          <h1 className="mt-4 text-3xl font-extrabold text-navy">Track a Parcel</h1>
          <p className="mt-2 text-muted">
            Enter your tracking code to see live delivery status. No account needed.
          </p>
        </div>

        <form onSubmit={submit} className="card mt-8">
          <label className="label">Tracking code</label>
          <input
            className="input mono text-center text-xl tracking-[0.3em] uppercase"
            placeholder="PB-8X4K"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoFocus
          />
          {error && <p className="mt-2 text-sm font-semibold text-danger">{error}</p>}
          <button type="submit" className="btn-primary mt-4 w-full">
            Track →
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
            <Icon name="lock" className="h-3.5 w-3.5" /> No phone numbers are shown on the tracking page.
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Sent a parcel while logged in? You&apos;ll also find it under{" "}
          <a href="/dashboard" className="font-semibold text-orange">My Sent Parcels</a>.
        </p>
      </main>
      <Footer />
    </>
  );
}
