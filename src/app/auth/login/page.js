"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") || "/dashboard";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });
    setBusy(false);
    if (res?.error) return setError("Invalid email or password");
    router.push(callbackUrl);
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-extrabold text-navy">Welcome back</h1>
      <p className="mt-1 text-muted">Log in to your traveler account.</p>

      <form onSubmit={submit} className="card mt-6 space-y-4">
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" className="input" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
        </div>
        {error && <p className="text-sm font-semibold text-danger">{error}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>

        <button type="button" onClick={() => signIn("google", { callbackUrl })} className="btn-outline w-full">
          Continue with Google
        </button>

        <div className="flex justify-between text-sm">
          <Link href="/auth/forgot-password" className="text-orange hover:underline">Forgot password?</Link>
          <Link href="/auth/register" className="text-orange hover:underline">Create account</Link>
        </div>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="py-20 text-center text-muted">Loading…</div>}>
        <LoginInner />
      </Suspense>
    </>
  );
}
