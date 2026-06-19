"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const role = session?.user?.role;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-navy text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold">
          <span className="text-2xl">📦</span> Parcel<span className="text-orange">Buddy</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/send" className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10">
            Send a Parcel
          </Link>
          <Link href="/parcels" className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10">
            Browse Jobs
          </Link>
          <Link href="/track" className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10">
            Track
          </Link>
          <Link href="/how-it-works" className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10">
            How it Works
          </Link>

          {session ? (
            <div className="ml-2 flex items-center gap-1">
              {isAdmin && (
                <Link href="/admin/dashboard" className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10">
                  Admin
                </Link>
              )}
              <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10">
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="ml-2 flex items-center gap-2">
              <Link href="/auth/login" className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10">
                Log in
              </Link>
              <Link href="/auth/register" className="btn-primary !py-2 !px-4 text-sm">
                Become a Traveler
              </Link>
            </div>
          )}
        </nav>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          <span className="text-2xl">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open && (
        <div className="space-y-1 border-t border-white/10 px-4 py-3 md:hidden">
          <Link href="/send" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10">Send a Parcel</Link>
          <Link href="/parcels" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10">Browse Jobs</Link>
          <Link href="/track" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10">Track a Parcel</Link>
          <Link href="/how-it-works" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10">How it Works</Link>
          {session ? (
            <>
              {isAdmin && <Link href="/admin/dashboard" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10">Admin</Link>}
              <Link href="/dashboard" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10">Dashboard</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-white/10">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10">Log in</Link>
              <Link href="/auth/register" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10">Become a Traveler</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
