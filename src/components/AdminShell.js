"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import Icon from "@/components/Icon";

const NAVY = "#1A2B5F";
const ORANGE = "#F97316";

const LINKS = [
  ["/admin/dashboard", "Dashboard", <Icon key="icon" name="layout-dashboard" className="h-5 w-5" />],
  ["/admin/verifications", "ID Reviews", <Icon key="icon" name="users" className="h-5 w-5" />],
  ["/admin/requests", "Requests", <Icon key="icon" name="box" className="h-5 w-5" />],
  ["/admin/couriers", "Couriers", <Icon key="icon" name="briefcase" className="h-5 w-5" />],
  ["/admin/disputes", "Disputes", <Icon key="icon" name="alert" className="h-5 w-5" />],
  ["/admin/messages", "Messages", <Icon key="icon" name="mail" className="h-5 w-5" />],
  ["/admin/config", "Config", <Icon key="icon" name="gear" className="h-5 w-5" />],
];

export default function AdminShell({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login?callbackUrl=/admin/dashboard");
    if (status === "authenticated" && !isAdmin) router.push("/dashboard");
  }, [status, isAdmin, router]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (status !== "authenticated" || !isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />
          <p className="text-sm font-medium text-gray-500">Checking admin access…</p>
        </div>
      </div>
    );
  }

  // Find current page title
  const currentLink = LINKS.find(l => l[0] === pathname);
  const pageTitle = currentLink ? currentLink[1] : "Admin";

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex z-10 shadow-sm">
        <div className="flex h-16 items-center border-b border-gray-100 px-6">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-full" />
            <span className="text-lg font-extrabold tracking-tight" style={{ color: NAVY }}>
              Parcel<span style={{ color: ORANGE }}>Buddy</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="mb-4 px-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            Overview
          </div>
          <nav className="space-y-1">
            {LINKS.map(([href, label, icon]) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                    active 
                      ? "bg-orange-50 text-orange-700" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  style={active ? { color: NAVY, background: "rgba(26,43,95,0.06)" } : {}}
                >
                  <span className="text-base">{icon}</span>
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-gray-100 p-4">
          <Link href="/dashboard" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
            <Icon name="home" className="h-4 w-4" /> Back to App
          </Link>
        </div>
      </aside>

      {/* ─── MOBILE SIDEBAR & OVERLAY ─── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-gray-100 px-6">
              <Link href="/" className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-full" />
                <span className="text-lg font-extrabold tracking-tight" style={{ color: NAVY }}>
                  Parcel<span style={{ color: ORANGE }}>Buddy</span>
                </span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
              {LINKS.map(([href, label, icon]) => {
                const active = pathname === href;
                return (
                  <Link key={href} href={href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    style={active ? { color: NAVY, background: "rgba(26,43,95,0.06)" } : {}}
                  >
                    <span className="text-base">{icon}</span> {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Header */}
        <header className="flex h-16 flex-none items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 md:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold" style={{ color: NAVY }}>{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1 pr-3 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700" style={{ background: "rgba(249,115,22,0.15)", color: ORANGE }}>
                  {session.user.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <span className="text-sm font-semibold text-gray-700 hidden sm:block">{session.user.name || "Admin"}</span>
                <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-gray-100 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-sm font-bold text-gray-900 truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                    </div>
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      User Dashboard
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
        
        {/* Admin Footer */}
        <footer className="border-t border-gray-200 bg-white py-4 px-6 text-center text-xs font-medium text-gray-400">
          © {new Date().getFullYear()} ParcelBuddy Admin Portal by <a href="https://www.habb.lk" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 underline decoration-gray-200 transition-colors">HABB Pvt Ltd</a>.
        </footer>

      </div>
    </div>
  );
}
