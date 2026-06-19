"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/client";

function VerifyInner() {
  const router = useRouter();
  const search = useSearchParams();
  const phone = search.get("phone") || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function verify(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/auth/verify-otp", { method: "POST", body: { phone, code } });
      router.push("/auth/login");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  async function resend() {
    setInfo("");
    setError("");
    try {
      await api("/api/auth/send-otp", { method: "POST", body: { phone } });
      setInfo("A new code has been sent.");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-extrabold text-navy">Verify your phone</h1>
      <p className="mt-1 text-muted">We sent a 6-digit code to {phone || "your phone"}.</p>

      <form onSubmit={verify} className="card mt-6 space-y-4">
        <input
          className="input mono text-center text-2xl tracking-[0.5em]"
          maxLength={6}
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />
        {error && <p className="text-sm font-semibold text-danger">{error}</p>}
        {info && <p className="text-sm font-semibold text-success">{info}</p>}
        <button className="btn-primary w-full" disabled={busy || code.length !== 6}>
          {busy ? "Verifying…" : "Verify"}
        </button>
        <button type="button" onClick={resend} className="btn-ghost w-full">Resend code</button>
      </form>
    </main>
  );
}

export default function VerifyPhonePage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="py-20 text-center text-muted">Loading…</div>}>
        <VerifyInner />
      </Suspense>
    </>
  );
}
