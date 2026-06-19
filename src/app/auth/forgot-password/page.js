"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/api/auth/forgot-password", { method: "POST", body: { email } });
      setSent(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-12">
        <h1 className="text-3xl font-extrabold text-navy">Reset your password</h1>
        {sent ? (
          <div className="card mt-6 text-center">
            <div className="text-4xl">📩</div>
            <p className="mt-3 text-muted">If an account exists for {email}, a reset link has been sent via SMS.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="card mt-6 space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button className="btn-primary w-full" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button>
          </form>
        )}
      </main>
    </>
  );
}
