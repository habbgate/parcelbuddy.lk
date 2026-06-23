"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";

const LINKS = [
  ["/send", "Send a Parcel"],
  ["/parcels", "Browse Jobs"],
  ["/track", "Track"],
  ["/how-it-works", "How it Works"],
];

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const role = session?.user?.role;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-navy/90 backdrop-blur-xl shadow-lg shadow-navy/10"
          : "bg-navy"
      } text-white`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 font-extrabold">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="ParcelBuddy" className="h-9 w-9 rounded-xl" />
          <span className="text-xl tracking-tight">
            Parcel<span className="text-orange">Buddy</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-white/10 ${
                pathname === href ? "text-orange" : "text-white/90"
              }`}
            >
              {label}
            </Link>
          ))}

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

        <button className="lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          <Icon name={open ? "x" : "menu"} className="h-7 w-7" />
        </button>
      </div>

      {open && (
        <div className="space-y-1 border-t border-white/10 px-4 py-3 lg:hidden animate-fade-in">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} className="block rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/10">
              {label}
            </Link>
          ))}
          {session ? (
            <>
              {isAdmin && <Link href="/admin/dashboard" className="block rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/10">Admin</Link>}
              <Link href="/dashboard" className="block rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/10">Dashboard</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold hover:bg-white/10">Sign out</button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/auth/login" className="btn-outline">Log in</Link>
              <Link href="/auth/register" className="btn-primary">Become a Traveler</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
