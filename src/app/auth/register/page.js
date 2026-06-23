"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/client";

const PERKS = [
  { icon: "💰", title: "Earn up to LKR 25K/month", desc: "On trips you already make" },
  { icon: "🔒", title: "Phone always private",      desc: "Never shown publicly" },
  { icon: "⚡", title: "Instant 90% payout",        desc: "Right when delivery confirms" },
  { icon: "📍", title: "40+ cities covered",         desc: "Island-wide network" },
];

const REVIEWS = [
  { name: "Kasun M.", city: "Colombo", text: "Made LKR 8,000 in my first week!", rating: 5 },
  { name: "Dilani R.", city: "Kandy",  text: "Super easy to start earning on my commute.", rating: 5 },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError]   = useState("");
  const [busy, setBusy]     = useState(false);
  const [showPw, setShowPw] = useState(false);
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
    <div className="flex min-h-screen">

      {/* ─── LEFT PANEL ─── */}
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden p-12 lg:flex"
        style={{ background: "linear-gradient(155deg, #0F172A 0%, #1E1045 60%, #0A1628 100%)" }}>

        {/* Blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-blob-1 absolute left-[-5%] top-[5%] h-72 w-72 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(124,58,237,0.45), transparent 70%)" }} />
          <div className="animate-blob-2 absolute right-[-10%] bottom-[30%] h-64 w-64 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,107,53,0.3), transparent 70%)" }} />
          <div className="animate-blob-3 absolute left-[30%] bottom-[0%] h-52 w-52 rounded-full blur-2xl"
            style={{ background: "radial-gradient(circle, rgba(20,184,166,0.2), transparent 70%)" }} />
        </div>
        <div className="dot-grid absolute inset-0 opacity-25" />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="ParcelBuddy" className="h-10 w-auto max-w-[40px] object-contain rounded-xl ring-2 ring-white/10" />
          <span className="text-xl font-extrabold text-white">
            Parcel<span style={{ color: "#FF6B35" }}>Buddy</span>
          </span>
        </div>

        {/* Main content */}
        <div className="relative">
          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold"
            style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", color: "#A78BFA" }}>
            🧳 Join 850+ Travelers
          </div>

          <h2 className="text-4xl font-extrabold leading-tight text-white">
            Start earning on<br />trips you already<br />
            <span style={{
              background: "linear-gradient(135deg, #FF8A5B, #FF6B35)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              make
            </span>
          </h2>
          <p className="mt-4 text-base text-white/50">
            No extra travel needed. Just pick up a parcel and earn while heading your usual route.
          </p>

          {/* Perks grid */}
          <div className="mt-7 grid grid-cols-2 gap-3">
            {PERKS.map(({ icon, title, desc }) => (
              <div key={title} className="rounded-xl p-3.5"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-xl">{icon}</div>
                <div className="mt-1.5 text-sm font-bold text-white">{title}</div>
                <div className="text-xs text-white/40">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini reviews */}
        <div className="relative space-y-3">
          {REVIEWS.map(({ name, city, text, rating }) => (
            <div key={name} className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: rating }).map((_, i) => (
                  <span key={i} className="text-amber-400 text-xs">★</span>
                ))}
              </div>
              <p className="text-xs italic text-white/55">&ldquo;{text}&rdquo;</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #FF6B35)" }}>
                  {name[0]}
                </div>
                <span className="text-xs font-semibold text-white/50">{name} · {city}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── RIGHT PANEL ─── */}
      <div className="flex flex-1 items-start justify-center overflow-y-auto px-5 py-12"
        style={{ background: "#FAFAF9" }}>
        <div className="w-full max-w-md animate-slide-in-right">

          {/* Mobile logo */}
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ParcelBuddy" className="h-9 w-auto max-w-[36px] object-contain rounded-xl" />
            <span className="text-xl font-extrabold" style={{ color: "#0F172A" }}>
              Parcel<span style={{ color: "#FF6B35" }}>Buddy</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold"
            style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", color: "#7C3AED" }}>
            🧳 Traveler Registration
          </div>
          <h1 className="text-3xl font-extrabold" style={{ color: "#0F172A" }}>Become a Traveler</h1>
          <p className="mt-2 text-muted">Earn money delivering parcels on trips you already make.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">

            {/* Full Name */}
            <div>
              <label className="label" htmlFor="reg-name">Full Name</label>
              <div className="relative">
                <input
                  id="reg-name"
                  className="input pr-10"
                  placeholder="John Perera"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label" htmlFor="reg-email">Email address</label>
              <div className="relative">
                <input
                  id="reg-email"
                  type="email"
                  className="input pr-10"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="label" htmlFor="reg-phone">Phone number</label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 rounded-xl border px-3 text-sm font-semibold"
                  style={{ borderColor: "#E4E4E7", background: "white", color: "#0F172A", whiteSpace: "nowrap" }}>
                  🇱🇰 +94
                </div>
                <input
                  id="reg-phone"
                  className="input flex-1"
                  placeholder="771234567"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label" htmlFor="reg-password">Password</label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPw ? "text" : "password"}
                  className="input pr-10"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-navy transition-colors">
                  {showPw ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#DC2626" }}>
                <svg className="h-4 w-4 flex-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Terms */}
            <p className="text-xs text-muted">
              By creating an account you agree to our{" "}
              <Link href="#" className="font-semibold hover:underline" style={{ color: "#FF6B35" }}>Terms of Service</Link>
              {" "}and{" "}
              <Link href="#" className="font-semibold hover:underline" style={{ color: "#FF6B35" }}>Privacy Policy</Link>.
            </p>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={busy}
              className="w-full rounded-xl py-3.5 text-base font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #9461FB 0%, #7C3AED 60%, #6D28D9 100%)",
                boxShadow: "0 6px 24px rgba(124,58,237,0.4)",
              }}
            >
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating account…
                </span>
              ) : "Create account — it's free →"}
            </button>

            {/* Login link */}
            <p className="text-center text-sm text-muted">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-bold hover:underline" style={{ color: "#FF6B35" }}>
                Log in →
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

