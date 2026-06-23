"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import FileUpload from "@/components/FileUpload";
import Icon from "@/components/Icon";
import { api } from "@/lib/client";
import { formatLKR } from "@/lib/format";

export default function ProfilePage() {
  const { status: authStatus } = useSession();
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/auth/login?callbackUrl=/profile");
    if (authStatus === "authenticated") api("/api/users/me").then((d) => setMe(d.user));
  }, [authStatus, router]);

  async function save(e) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/users/me", { method: "PUT", body: { name: me.name, bio: me.bio, phone: me.phone } });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e.message);
    }
  }

  async function onAvatar(urls) {
    if (!urls[0]) return;
    await api("/api/users/me/avatar", { method: "POST", body: { avatarUrl: urls[0] } });
    setMe((m) => ({ ...m, avatarUrl: urls[0] }));
  }

  if (!me) return <><Navbar /><div className="py-20 text-center text-muted">Loading…</div></>;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-3xl font-extrabold text-navy">My Profile</h1>

        <div className="card mt-6 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={me.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${me.name}`} alt="avatar" className="h-20 w-20 rounded-full border border-border object-cover" />
          <div>
            <div className="text-xl font-bold text-navy">{me.name}</div>
            <div className="flex items-center gap-1 text-sm text-muted"><Icon name="star" className="h-4 w-4 text-amber" fill="currentColor" /> {me.stats.averageRating || "—"} · {me.stats.totalDeliveries} deliveries · {formatLKR(me.stats.totalEarningsLKR)} earned</div>
            <div className="mt-1 text-xs font-semibold uppercase text-muted">{me.status}</div>
          </div>
        </div>

        <form onSubmit={save} className="card mt-6 space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input" value={me.name} onChange={(e) => setMe((m) => ({ ...m, name: e.target.value }))} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={me.phone || ""} onChange={(e) => setMe((m) => ({ ...m, phone: e.target.value }))} />
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea className="input" rows={3} value={me.bio || ""} onChange={(e) => setMe((m) => ({ ...m, bio: e.target.value }))} />
          </div>
          <div>
            <label className="label">Avatar</label>
            <FileUpload folder="avatars" max={1} value={me.avatarUrl ? [me.avatarUrl] : []} onChange={onAvatar} label="Upload a profile photo" />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button className="btn-primary">{saved ? "Saved!" : "Save changes"}</button>
        </form>
      </main>
    </>
  );
}
