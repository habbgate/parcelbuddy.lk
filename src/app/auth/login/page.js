"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function EyeIcon({ open }) {
  return open ? (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

const RED    = "#DC2626";
const RED_LT = "#EF4444";
const DARK   = "#111827";
const DARK2  = "#1F2937";

function LoginInner() {
  const router      = useRouter();
  const search      = useSearchParams();
  const callbackUrl = search.get("callbackUrl") || "/dashboard";
  const [form, setForm]   = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy]   = useState(false);
  const [showPw, setShowPw] = useState(false);

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
    if (res?.error) return setError("Invalid email or password. Please try again.");
    router.push(callbackUrl);
  }

  return (
    <div className="flex min-h-screen">

      {/* ─── LEFT PANEL ─── */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex"
        style={{ background: `linear-gradient(155deg, ${DARK} 0%, #0D1117 60%, ${DARK} 100%)` }}>

        {/* Animated blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-blob-1 absolute left-[-10%] top-[-5%] h-80 w-80 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(220,38,38,0.35), transparent 70%)" }} />
          <div className="animate-blob-2 absolute right-[-5%] bottom-[20%] h-72 w-72 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(185,28,28,0.25), transparent 70%)" }} />
          <div className="animate-blob-3 absolute left-[40%] bottom-[5%] h-56 w-56 rounded-full blur-2xl"
            style={{ background: "radial-gradient(circle, rgba(239,68,68,0.15), transparent 70%)" }} />
        </div>
        <div className="dot-grid absolute inset-0 opacity-25" />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="ParcelBuddy" className="h-10 w-auto max-w-[40px] object-contain" />
          <span className="text-xl font-extrabold text-white">
            Parcel<span style={{ color: RED_LT }}>Buddy</span>
          </span>
        </div>

        {/* Main copy */}
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold"
            style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "#FCA5A5" }}>
            Welcome back
          </div>
          <h2 className="text-4xl font-extrabold leading-tight text-white">
            Your journey<br />continues here
          </h2>
          <p className="mt-4 text-lg text-white/50">
            Log in to manage your deliveries, track parcels, and access your earnings.
          </p>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { val: "2,400+", label: "Deliveries" },
              { val: "850+",   label: "Travelers"  },
              { val: "4.9",    label: "Avg Rating"  },
              { val: "40+",    label: "Cities"      },
            ].map(({ val, label }) => (
              <div key={label} className="rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-xl font-bold text-white">{val}</div>
                <div className="text-xs text-white/40">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-sm italic text-white/60">
            &ldquo;I earn an extra LKR 15,000 a month just delivering parcels on my daily Kandy&ndash;Colombo commute!&rdquo;
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${RED_LT}, ${RED})` }}>A</div>
            <div>
              <div className="text-sm font-bold text-white">Ashan Perera</div>
              <div className="text-xs text-white/40">Verified Traveler &middot; Kandy</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL ─── */}
      <div className="flex flex-1 items-center justify-center px-5 py-12 bg-white">
        <div className="w-full max-w-md animate-slide-in-right">

          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ParcelBuddy" className="h-9 w-auto max-w-[36px] object-contain" />
            <span className="text-xl font-extrabold" style={{ color: DARK2 }}>
              Parcel<span style={{ color: RED }}>Buddy</span>
            </span>
          </div>

          <h1 className="text-3xl font-extrabold" style={{ color: DARK2 }}>Welcome back</h1>
          <p className="mt-2 text-muted">Log in to your traveler account.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label className="label" htmlFor="login-email">Email address</label>
              <div className="relative">
                <input id="login-email" type="email" className="input pr-10"
                  placeholder="you@email.com" value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label className="label" htmlFor="login-password">Password</label>
                <Link href="/auth/forgot-password" className="text-xs font-semibold hover:underline" style={{ color: RED }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input id="login-password" type={showPw ? "text" : "password"}
                  className="input pr-10" placeholder="••••••••" value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} required />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-navy">
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium"
                style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.18)", color: RED }}>
                <svg className="h-4 w-4 flex-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button id="login-submit" type="submit" disabled={busy}
              className="w-full rounded-xl py-3.5 text-base font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, ${RED_LT} 0%, ${RED} 60%, #B91C1C 100%)`,
                boxShadow: "0 6px 24px rgba(220,38,38,0.35)",
              }}>
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Logging in&hellip;
                </span>
              ) : "Log in \u2192"}
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-medium text-muted">or continue with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google */}
            <button id="login-google" type="button" onClick={() => signIn("google", { callbackUrl })}
              className="group w-full rounded-xl border-2 py-3.5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderColor: "#E5E7EB", background: "white", color: DARK2 }}>
              <span className="flex items-center justify-center gap-3">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </span>
            </button>

            {/* Register link */}
            <p className="text-center text-sm text-muted">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="font-bold hover:underline" style={{ color: RED }}>
                Create account &rarr;
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200 border-t-red-600" />
      </div>
    }>
      <LoginInner />
    </Suspense>
  );
}
