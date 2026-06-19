"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/client";

function ResetInner() {
  const router = useRouter();
  const search = useSearchParams();
  const token = search.get("token") || "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/auth/reset-password", { method: "POST", body: { token, password } });
      router.push("/auth/login");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-extrabold text-navy">Choose a new password</h1>
      <form onSubmit={submit} className="card mt-6 space-y-4">
        <div>
          <label className="label">New password</label>
          <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-sm font-semibold text-danger">{error}</p>}
        <button className="btn-primary w-full" disabled={busy || !token}>{busy ? "Saving…" : "Reset password"}</button>
        {!token && <p className="text-sm text-danger">Missing reset token. Use the link from your SMS.</p>}
      </form>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="py-20 text-center text-muted">Loading…</div>}>
        <ResetInner />
      </Suspense>
    </>
  );
}
