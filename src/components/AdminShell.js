"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const LINKS = [
  ["/admin/dashboard", "Dashboard", "📊"],
  ["/admin/verifications", "ID Reviews", "🪪"],
  ["/admin/requests", "Requests", "📦"],
  ["/admin/travelers", "Travelers", "🚗"],
  ["/admin/disputes", "Disputes", "⚠️"],
  ["/admin/config", "Config", "⚙️"],
];

export default function AdminShell({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login?callbackUrl=/admin/dashboard");
    if (status === "authenticated" && !isAdmin) router.push("/dashboard");
  }, [status, isAdmin, router]);

  if (status !== "authenticated" || !isAdmin) {
    return <div className="py-20 text-center text-muted">Checking admin access…</div>;
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="hidden w-56 flex-none border-r border-border bg-navy text-white md:block">
        <Link href="/" className="block px-5 py-4 text-lg font-extrabold">
          📦 Parcel<span className="text-orange">Buddy</span>
        </Link>
        <nav className="mt-2 space-y-1 px-3">
          {LINKS.map(([href, label, icon]) => (
            <Link key={href} href={href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${pathname === href ? "bg-white/15" : "hover:bg-white/10"}`}>
              <span>{icon}</span> {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">
        {/* Mobile nav */}
        <div className="flex gap-1 overflow-x-auto border-b border-border bg-white px-3 py-2 md:hidden">
          {LINKS.map(([href, label, icon]) => (
            <Link key={href} href={href} className={`flex-none rounded-lg px-3 py-1.5 text-xs font-semibold ${pathname === href ? "bg-navy text-white" : "text-muted"}`}>
              {icon} {label}
            </Link>
          ))}
        </div>
        <main className="mx-auto max-w-5xl p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
