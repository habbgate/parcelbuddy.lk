"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";

const NAVY   = "#1A2B5F";
const ORANGE = "#F97316";

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
          <h1 className="text-3xl font-extrabold" style={{ color: NAVY }}>Welcome back</h1>
          <p className="mt-2 text-muted">Log in to your traveler account.</p>
        </div>

        <div className="rounded-3xl border bg-white p-8" style={{ borderColor: "#E2E8F0", boxShadow: "0 20px 60px rgba(26,43,95,0.06)" }}>
          <form onSubmit={submit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="label" htmlFor="login-email">Email address</label>
              <div className="relative">
                <input id="login-email" type="email" className="input pr-10"
                  placeholder="you@email.com" value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                  <Icon name="mail" className="h-4 w-4" />
                </span>
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label className="label" htmlFor="login-password">Password</label>
                <Link href="/auth/forgot-password" className="text-xs font-semibold hover:underline" style={{ color: ORANGE }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input id="login-password" type={showPw ? "text" : "password"}
                  className="input pr-10" placeholder="••••••••" value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} required />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-navy">
                  <Icon name={showPw ? "eye" : "eye-off"} className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium"
                style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", color: "#DC2626" }}>
                <Icon name="alert-circle" className="h-4 w-4 flex-none" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button id="login-submit" type="submit" disabled={busy}
              className="w-full rounded-xl py-3.5 text-base font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, #FB923C, ${ORANGE}, #EA6C00)`,
                boxShadow: "0 6px 24px rgba(249,115,22,0.35)",
              }}>
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Logging in&hellip;
                </span>
              ) : "Log in \u2192"}
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-medium text-muted">or continue with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google */}
            <button id="login-google" type="button" onClick={() => signIn("google", { callbackUrl })}
              className="group w-full rounded-xl border-2 py-3.5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-md bg-white"
              style={{ borderColor: "#E2E8F0", color: NAVY }}>
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
            <p className="text-center text-sm text-muted pt-2">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="font-bold hover:underline" style={{ color: ORANGE }}>
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200 border-t-[#F97316]" />
      </div>
    }>
      <LoginInner />
    </Suspense>
  );
}
