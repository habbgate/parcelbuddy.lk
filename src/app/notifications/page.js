"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/client";
import { timeAgo } from "@/lib/format";

export default function NotificationsPage() {
  const { status: authStatus } = useSession();
  const router = useRouter();
  const [notifs, setNotifs] = useState([]);

  async function load() {
    const d = await api("/api/users/me/notifications");
    setNotifs(d.notifications);
  }

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/auth/login?callbackUrl=/notifications");
    if (authStatus === "authenticated") load();
  }, [authStatus, router]);

  async function markRead(id) {
    await api(`/api/users/me/notifications/${id}/read`, { method: "PATCH" });
    setNotifs((ns) => ns.map((n) => (n._id === id ? { ...n, readAt: new Date() } : n)));
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-3xl font-extrabold text-navy">Notifications</h1>
        <div className="card mt-6 divide-y divide-border">
          {notifs.length ? notifs.map((n) => (
            <div key={n._id} className={`flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0 ${n.readAt ? "opacity-60" : ""}`}>
              <Link href={n.link || "#"} onClick={() => markRead(n._id)} className="flex-1">
                <div className="font-semibold text-navy">{n.title}</div>
                {n.body && <div className="text-sm text-muted">{n.body}</div>}
                <div className="text-xs text-muted">{timeAgo(n.createdAt)}</div>
              </Link>
              {!n.readAt && <button onClick={() => markRead(n._id)} className="text-xs font-semibold text-orange">Mark read</button>}
            </div>
          )) : <p className="text-muted">No notifications yet.</p>}
        </div>
      </main>
    </>
  );
}

