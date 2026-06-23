"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/client";
import Icon from "@/components/Icon";

const NAVY   = "#1A2B5F";
const ORANGE = "#F97316";

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState("");
  const [sent, setSent]     = useState(false);
  const [busy, setBusy]     = useState(false);
  const [error, setError]   = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/auth/forgot-password", { method: "POST", body: { email } });
      setSent(true);
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16 relative overflow-hidden bg-white">

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[5%] top-[10%] h-80 w-80 rounded-full blur-3xl opacity-10"
          style={{ background: `radial-gradient(circle, ${NAVY}, transparent)` }} />
        <div className="absolute right-[5%] bottom-[10%] h-80 w-80 rounded-full blur-3xl opacity-10"
          style={{ background: `radial-gradient(circle, ${ORANGE}, transparent)` }} />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md animate-fade-up z-10">

        {/* Brand header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="group inline-flex items-center gap-2.5 mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="relative">
              <div className="absolute inset-0 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-all"
                style={{ background: ORANGE }} />
              <img src="/logo.png" alt="ParcelBuddy" className="relative h-12 w-12 object-contain rounded-full border border-gray-100 bg-white p-1" />
            </div>
            <span className="text-xl font-extrabold" style={{ color: NAVY }}>
              Parcel<span style={{ color: ORANGE }}>Buddy</span>
            </span>
          </Link>
        </div>

        {sent ? (
          /* ─── SUCCESS STATE ─── */
          <div className="rounded-3xl border p-10 text-center bg-white"
            style={{
              borderColor: "#E2E8F0",
              boxShadow: "0 20px 60px rgba(26,43,95,0.06)",
            }}>
            {/* Animated success icon */}
            <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full opacity-20"
                style={{ background: "linear-gradient(135deg, #10B981, #059669)", animationDuration: "2s" }} />
              <div className="absolute inset-2 animate-pulse rounded-full opacity-30"
                style={{ background: "linear-gradient(135deg, #10B981, #059669)" }} />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full text-white"
                style={{ background: "linear-gradient(135deg, #34D399, #10B981)", boxShadow: "0 8px 24px rgba(16,185,129,0.4)" }}>
                <Icon name="check" className="h-8 w-8" />
              </div>
            </div>

            <h1 className="text-2xl font-extrabold" style={{ color: NAVY }}>Check your inbox!</h1>
            <p className="mt-3 text-muted">
              If an account exists for{" "}
              <strong className="font-bold" style={{ color: NAVY }}>{email}</strong>,
              a password reset link has been sent via SMS and email.
            </p>

            <div className="mt-6 rounded-2xl p-4 text-sm flex items-center gap-2 justify-center"
              style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", color: "#059669" }}>
              <Icon name="mail" className="h-4 w-4" />
              Check your SMS messages too — the link expires in 1 hour.
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Link href="/auth/login"
                className="w-full rounded-xl py-3.5 text-base font-bold text-white text-center transition-all hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, #FB923C, ${ORANGE}, #EA6C00)`, boxShadow: "0 6px 24px rgba(249,115,22,0.35)" }}>
                Back to Login →
              </Link>
              <button onClick={() => { setSent(false); setEmail(""); }}
                className="w-full rounded-xl border py-3 text-sm font-semibold transition-all hover:bg-gray-50"
                style={{ borderColor: "#E2E8F0", color: "#64748B" }}>
                Try a different email
              </button>
            </div>
          </div>
        ) : (
          /* ─── FORM STATE ─── */
          <div className="rounded-3xl border p-10 bg-white"
            style={{
              borderColor: "#E2E8F0",
              boxShadow: "0 20px 60px rgba(26,43,95,0.06)",
            }}>
            {/* Icon */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(26,43,95,0.1))",
                border: "1px solid rgba(249,115,22,0.2)",
              }}>
              <Icon name="key" className="h-8 w-8" style={{ color: ORANGE }} />
            </div>

            <h1 className="text-2xl font-extrabold" style={{ color: NAVY }}>Forgot your password?</h1>
            <p className="mt-2 text-muted">
              No worries — enter your email and we&apos;ll send you a reset link instantly.
            </p>

            <form onSubmit={submit} className="mt-8 space-y-5">
              <div>
                <label className="label" htmlFor="forgot-email">Email address</label>
                <div className="relative">
                  <input
                    id="forgot-email"
                    type="email"
                    className="input pr-10"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                    <Icon name="mail" className="h-4 w-4" />
                  </span>
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

              <button
                id="forgot-submit"
                type="submit"
                disabled={busy}
                className="w-full rounded-xl py-3.5 text-base font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, #FB923C, ${ORANGE}, #EA6C00)`,
                  boxShadow: "0 6px 24px rgba(249,115,22,0.4)",
                }}
              >
                {busy ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending reset link…
                  </span>
                ) : "Send reset link →"}
              </button>
            </form>

            {/* Bottom links */}
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted">
              <Link href="/auth/login" className="font-semibold transition-colors" style={{ color: NAVY }}>
                ← Back to Login
              </Link>
              <span>·</span>
              <Link href="/auth/register" className="font-semibold transition-colors hover:underline" style={{ color: ORANGE }}>
                Create account
              </Link>
            </div>
          </div>
        )}

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-muted flex items-center justify-center gap-2">
          <Icon name="lock" className="h-3.5 w-3.5" /> Your phone stays private — always.
        </p>
      </div>
    </div>
  );
}
