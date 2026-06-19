"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/client";
import { formatDate } from "@/lib/format";

export default function PublicProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api(`/api/users/${userId}/profile`),
      api(`/api/users/${userId}/reviews`),
    ])
      .then(([p, r]) => {
        setProfile(p.profile);
        setReviews(r.reviews);
      })
      .catch((e) => setError(e.message));
  }, [userId]);

  if (error) return <><Navbar /><div className="card mx-auto mt-10 max-w-md text-center">{error}</div></>;
  if (!profile) return <><Navbar /><div className="py-20 text-center text-muted">Loading…</div></>;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="card flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} alt="avatar" className="h-20 w-20 rounded-full border border-border object-cover" />
          <div>
            <div className="text-xl font-bold text-navy">{profile.name}</div>
            <div className="text-sm text-muted">⭐ {profile.stats.averageRating || "—"} ({profile.stats.reviewCount} reviews) · {profile.stats.totalDeliveries} deliveries</div>
            <div className="text-xs text-muted">Member since {formatDate(profile.memberSince)}</div>
          </div>
        </div>
        {profile.bio && <div className="card mt-4 text-sm text-muted">{profile.bio}</div>}

        <h2 className="mt-8 text-lg font-bold text-navy">Reviews</h2>
        <div className="mt-3 space-y-3">
          {reviews.length ? reviews.map((r, i) => (
            <div key={i} className="card">
              <div className="flex items-center justify-between">
                <span className="text-amber">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                <span className="text-xs text-muted">{r.route}</span>
              </div>
              {r.comment && <p className="mt-1 text-sm text-navy">{r.comment}</p>}
              <p className="mt-1 text-xs text-muted">— {r.by}</p>
            </div>
          )) : <p className="text-muted">No reviews yet.</p>}
        </div>
      </main>
      <Footer />
    </>
  );
}
