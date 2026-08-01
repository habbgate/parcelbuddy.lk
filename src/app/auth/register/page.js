"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/client";
import Icon from "@/components/Icon";

const NAVY   = "#1A2B5F";
const ORANGE = "#F97316";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy]   = useState(false);
  const [showPw, setShowPw] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      await api("/api/auth/register", { method: "POST", body: form });
      router.push("/auth/login?registered=true");
    } catch (err) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[5%] top-[10%] h-80 w-80 rounded-full blur-3xl opacity-10"
          style={{ background: `radial-gradient(circle, ${NAVY}, transparent)` }} />
        <div className="absolute right-[5%] bottom-[10%] h-80 w-80 rounded-full blur-3xl opacity-10"
          style={{ background: `radial-gradient(circle, ${ORANGE}, transparent)` }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-up">

        {/* Brand header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="group inline-flex items-center gap-2 mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-all"
                style={{ background: ORANGE }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="ParcelBuddy" className="relative h-12 w-12 object-contain rounded-full border border-gray-100 bg-white p-1" />
            </div>
            <span className="text-xl font-extrabold" style={{ color: NAVY }}>
              Parcel<span style={{ color: ORANGE }}>Buddy</span>
            </span>
          </Link>

          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: "rgba(26,43,95,0.08)", color: NAVY }}>
            <Icon name="briefcase" className="h-3.5 w-3.5" /> Create Your Account
          </div>
          <h1 className="text-3xl font-extrabold" style={{ color: NAVY }}>Join ParcelBuddy</h1>
          <p className="mt-2 text-muted">One account to send parcels and deliver as a courier — earn cash on trips you already make.</p>
        </div>

        <div className="rounded-3xl border bg-white p-8" style={{ borderColor: "#E2E8F0", boxShadow: "0 20px 60px rgba(26,43,95,0.06)" }}>
          <form onSubmit={submit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="label" htmlFor="reg-name">Full Name</label>
              <div className="relative">
                <input id="reg-name" type="text" className="input pr-10"
                  placeholder="John Perera" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                  <Icon name="user" className="h-4 w-4" />
                </span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label" htmlFor="reg-email">Email address</label>
              <div className="relative">
                <input id="reg-email" type="email" className="input pr-10"
                  placeholder="you@email.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                  <Icon name="mail" className="h-4 w-4" />
                </span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="label" htmlFor="reg-phone">Phone number</label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center rounded-xl border bg-gray-50 px-4 text-sm font-medium text-gray-500"
                  style={{ borderColor: "#E5E7EB" }}>
                  LK +94
                </div>
                <input id="reg-phone" type="tel" className="input flex-1"
                  placeholder="771234567" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label" htmlFor="reg-password">Password</label>
              <div className="relative">
                <input id="reg-password" type={showPw ? "text" : "password"} className="input pr-10"
                  placeholder="Min. 8 characters" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-navy">
                  <Icon name={showPw ? "eye" : "eye-off"} className="h-4 w-4" />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium"
                style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.18)", color: "#DC2626" }}>
                <Icon name="alert-circle" className="h-4 w-4 flex-none" />
                {error}
              </div>
            )}

            <div className="text-xs text-muted">
              By creating an account you agree to our{" "}
              <Link href="#" className="font-semibold hover:underline" style={{ color: ORANGE }}>Terms of Service</Link>
              {" "}and{" "}
              <Link href="#" className="font-semibold hover:underline" style={{ color: ORANGE }}>Privacy Policy</Link>.
            </div>

            <button type="submit" disabled={busy}
              className="w-full rounded-xl py-3.5 text-base font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, #FB923C, ${ORANGE}, #EA6C00)`,
                boxShadow: "0 6px 24px rgba(249,115,22,0.35)",
              }}>
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating account&hellip;
                </span>
              ) : "Create account \u2192"}
            </button>

            <p className="text-center text-sm text-muted pt-2">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-bold hover:underline" style={{ color: ORANGE }}>
                Log in &rarr;
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
