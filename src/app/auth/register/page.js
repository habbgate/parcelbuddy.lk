"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/client";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/auth/register", { method: "POST", body: form });
      router.push(`/auth/verify-phone?phone=${encodeURIComponent(form.phone)}`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-12">
        <h1 className="text-3xl font-extrabold text-navy">Become a Traveler</h1>
        <p className="mt-1 text-muted">Earn money delivering parcels on trips you already make.</p>

        <form onSubmit={submit} className="card mt-6 space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" placeholder="0771234567" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="input" value={form.password} onChange={(e) => set("password", e.target.value)} />
          </div>
          {error && <p className="text-sm font-semibold text-danger">{error}</p>}
          <button className="btn-primary w-full" disabled={busy}>{busy ? "Creating…" : "Create account"}</button>
          <p className="text-center text-sm text-muted">
            Already have an account? <Link href="/auth/login" className="text-orange hover:underline">Log in</Link>
          </p>
        </form>
      </main>
    </>
  );
}
