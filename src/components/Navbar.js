"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";

const LINKS = [
  ["/send",         "Send Parcel",  "box"],
  ["/parcels",      "Browse Jobs",  "briefcase"],
  ["/track",        "Track",        "map-pin"],
  ["/how-it-works", "How it Works", "help-circle"],
];

// Brand colors matching the logo
const NAVY   = "#1A2B5F";
const ORANGE = "#F97316";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const role     = session?.user?.role;
  const isAdmin  = role === "ADMIN" || role === "SUPER_ADMIN";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: "white",
          borderBottom: scrolled
            ? "1px solid rgba(26,43,95,0.10)"
            : "1px solid rgba(226,232,240,0.8)",
          boxShadow: scrolled ? "0 2px 20px rgba(26,43,95,0.08)" : "none",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">

          {/* ─── Logo ─── */}
          <Link href="/" className="group flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="ParcelBuddy"
              className="h-12 w-12 object-contain rounded-full transition-transform duration-300 group-hover:scale-105"
              style={{ filter: "drop-shadow(0 2px 6px rgba(26,43,95,0.15))" }}
            />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-extrabold tracking-tight" style={{ color: NAVY }}>
                Parcel<span style={{ color: ORANGE }}>Buddy</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: ORANGE }}>
                Sri Lanka
              </span>
            </div>
          </Link>

          {/* ─── Desktop nav ─── */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {LINKS.map(([href, label]) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  className="relative rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200"
                  style={{
                    color: active ? NAVY : "#64748B",
                    background: active ? "rgba(26,43,95,0.06)" : "transparent",
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(26,43,95,0.04)"; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  {label}
                  {active && (
                    <span className="absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full"
                      style={{ background: ORANGE }} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ─── Desktop auth ─── */}
          <div className="hidden items-center gap-2 lg:flex">
            {session ? (
              <>
                {isAdmin && (
                  <Link href="/admin/dashboard"
                    className="rounded-lg px-3 py-2 text-sm font-semibold transition-all"
                    style={{ color: "#64748B" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(26,43,95,0.05)"; e.currentTarget.style.color = NAVY; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748B"; }}>
                    Admin
                  </Link>
                )}
                <Link href="/dashboard"
                  className="rounded-lg px-3 py-2 text-sm font-semibold transition-all"
                  style={{ color: "#64748B" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(26,43,95,0.05)"; e.currentTarget.style.color = NAVY; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748B"; }}>
                  Dashboard
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-xl border px-4 py-2 text-sm font-bold transition-all"
                  style={{ borderColor: "#E2E8F0", color: "#64748B" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = NAVY; e.currentTarget.style.color = NAVY; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#64748B"; }}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login"
                  className="rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                  style={{ color: NAVY }}>
                  Log in
                </Link>
                <Link href="/auth/register"
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(135deg, #FB923C, ${ORANGE}, #EA6C00)`,
                    boxShadow: "0 4px 16px rgba(249,115,22,0.40)",
                  }}>
                  <Icon name="zap" className="h-4 w-4" />
                  Become a Traveler
                </Link>
              </>
            )}
          </div>

          {/* ─── Mobile hamburger ─── */}
          <button
            id="mobile-menu-btn"
            className="flex h-10 w-10 items-center justify-center rounded-xl border transition-all lg:hidden"
            style={{ borderColor: "#E2E8F0", color: NAVY }}
            onClick={() => setOpen(o => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <Icon name={open ? "x" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* ─── Mobile overlay ─── */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(26,43,95,0.4)", backdropFilter: "blur(4px)" }}
        onClick={() => setOpen(false)}
      />

      {/* ─── Mobile drawer ─── */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-white lg:hidden transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ boxShadow: "-20px 0 60px rgba(26,43,95,0.15)", borderLeft: "1px solid #E2E8F0" }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "#E2E8F0" }}>
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ParcelBuddy" className="h-10 w-10 object-contain rounded-full" />
            <span className="text-lg font-extrabold" style={{ color: NAVY }}>
              Parcel<span style={{ color: ORANGE }}>Buddy</span>
            </span>
          </div>
          <button onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border transition-all"
            style={{ borderColor: "#E2E8F0", color: "#64748B" }}>
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex flex-col gap-1 px-3 py-4">
          {LINKS.map(([href, label, icon]) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-all"
                style={{
                  background: active ? "rgba(26,43,95,0.08)" : "transparent",
                  color: active ? NAVY : "#64748B",
                }}>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: active ? "rgba(26,43,95,0.10)" : "#F8FAFC" }}>
                  <Icon name={icon} className="h-4 w-4" style={{ color: active ? NAVY : "#94A3B8" }} />
                </span>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mx-4 h-px bg-gray-100" />

        {/* Drawer auth */}
        <div className="px-3 py-4">
          {session ? (
            <div className="flex flex-col gap-2">
              {isAdmin && (
                <Link href="/admin/dashboard"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-all"
                  style={{ color: "#64748B" }}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50">
                    <Icon name="shield" className="h-4 w-4 text-slate-400" />
                  </span>
                  Admin
                </Link>
              )}
              <Link href="/dashboard"
                className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-all"
                style={{ color: "#64748B" }}>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50">
                  <Icon name="layout-dashboard" className="h-4 w-4 text-slate-400" />
                </span>
                Dashboard
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })}
                className="mt-2 w-full rounded-xl border py-3 text-center font-semibold transition-all"
                style={{ borderColor: "#E2E8F0", color: "#64748B" }}>
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href="/auth/login"
                className="w-full rounded-xl border-2 py-3 text-center font-bold transition-all"
                style={{ borderColor: NAVY, color: NAVY }}>
                Log in
              </Link>
              <Link href="/auth/register"
                className="w-full rounded-xl py-3 text-center font-bold text-white transition-all hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg, #FB923C, ${ORANGE}, #EA6C00)`,
                  boxShadow: "0 4px 20px rgba(249,115,22,0.4)",
                }}>
                Become a Traveler
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
