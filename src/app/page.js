import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParcelCard from "@/components/ParcelCard";
import Counter from "@/components/Counter";
import Icon from "@/components/Icon";
import { fetchOpenRequests, fetchPlatformStats } from "@/lib/queries";
import { SRI_LANKAN_CITIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const [recent, stats] = await Promise.all([
      fetchOpenRequests({ limit: 4 }),
      fetchPlatformStats(),
    ]);
    return { recent, stats };
  } catch {
    return { recent: [], stats: { deliveries: 0, travelers: 0, cities: 0 } };
  }
}

export default async function HomePage() {
  const { recent, stats } = await getData();

  const senderSteps = [
    ["pencil",       "Post your parcel",   "Fill a quick form — no signup needed."],
    ["bell",         "Get matched",        "A verified traveler on your route accepts."],
    ["users",        "Hand it over",       "Their contact is shared so you can coordinate."],
    ["check-circle", "Confirm delivery",   "Tap the SMS link once it arrives."],
  ];
  const travelerSteps = [
    ["id-card",  "Verify your ID", "Upload your NIC or passport once."],
    ["search",   "Find jobs",      "Browse parcels going your way."],
    ["car",      "Deliver",        "Collect, travel, and drop it off."],
    ["wallet",   "Earn",           "Get paid 90% of the reward, instantly."],
  ];

  const features = [
    { icon: "lock",     title: "Phone stays private",        desc: "Your number is shared only with the one verified traveler who accepts.", gradient: "from-violet-500 to-purple-600", bg: "rgba(124,58,237,0.08)", color: "#7C3AED", size: "lg" },
    { icon: "shield",   title: "Verified travelers",          desc: "Every traveler passes NIC/Passport identity checks before they can carry.", gradient: "from-teal-500 to-emerald-600", bg: "rgba(20,184,166,0.08)", color: "#14B8A6", size: "lg" },
    { icon: "coins",    title: "Earn on trips you make",     desc: "Turn an empty seat or bag into income on your usual route.", gradient: "from-orange-400 to-red-500", bg: "rgba(255,107,53,0.08)", color: "#FF6B35", size: "sm" },
    { icon: "map-pin",  title: "Live tracking",              desc: "Follow every step — posted, matched, collected, in transit, delivered.", gradient: "from-blue-500 to-indigo-600", bg: "rgba(99,102,241,0.08)", color: "#6366F1", size: "sm" },
    { icon: "star",     title: "Ratings & reviews",          desc: "Build trust with a public profile and review history.", gradient: "from-amber-400 to-orange-500", bg: "rgba(245,158,11,0.08)", color: "#F59E0B", size: "sm" },
    { icon: "zap",      title: "Instant payouts",            desc: "90% of the reward lands in your wallet the moment delivery is confirmed.", gradient: "from-green-400 to-emerald-500", bg: "rgba(16,185,129,0.08)", color: "#10B981", size: "sm" },
  ];

  return (
    <>
      <Navbar />

      {/* ═══════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════ */}
      <section className="relative min-h-[92vh] overflow-hidden mesh-hero text-white flex flex-col">

        {/* Animated blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-blob-1 absolute left-[10%] top-[15%] h-96 w-96 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(124,58,237,0.5), transparent 70%)" }} />
          <div className="animate-blob-2 absolute right-[8%] top-[10%] h-80 w-80 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,107,53,0.35), transparent 70%)" }} />
          <div className="animate-blob-3 absolute bottom-[10%] left-[40%] h-72 w-72 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(20,184,166,0.25), transparent 70%)" }} />
        </div>

        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-40" />

        {/* Hero content */}
        <div className="relative flex-1 mx-auto grid max-w-7xl w-full items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">

          {/* Left: text */}
          <div className="animate-fade-up">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full px-4 py-2"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
              }}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full"
                style={{ background: "linear-gradient(135deg, #FF6B35, #E8420A)" }}>
                <Icon name="map-pin" className="h-3 w-3 text-white" fill="currentColor" />
              </span>
              <span className="text-sm font-semibold text-white/80">Sri Lanka&apos;s #1 Community Delivery Network</span>
              <span className="ml-1 rounded-full px-2 py-0.5 text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, #FF6B35, #E8420A)" }}>
                NEW
              </span>
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Turn Your<br />
              Journey Into{" "}
              <span className="relative">
                <span className="gradient-text">Income</span>
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/65">
              ParcelBuddy connects people sending parcels with <strong className="text-white/90">verified travelers</strong> heading
              the same way. Send affordably. Travel and earn.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/send"
                className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl px-7 py-4 text-base font-bold text-white transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "linear-gradient(135deg, #FF8A5B 0%, #FF6B35 60%, #E8420A 100%)",
                  boxShadow: "0 6px 24px rgba(255,107,53,0.5), 0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                <span className="relative flex items-center gap-2">
                  <Icon name="box" className="h-5 w-5" />
                  Send a Parcel
                </span>
              </Link>

              <Link
                href="/parcels"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border-2 px-7 py-4 text-base font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
                style={{
                  borderColor: "rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <Icon name="car" className="h-5 w-5 text-orange" />
                Deliver &amp; Earn
              </Link>
            </div>

            {/* Trust pills */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {[
                { icon: "star", text: "4.9 avg rating", fill: "currentColor" },
                { icon: "lock", text: "Phone-private" },
                { icon: "zap",  text: "Instant payouts" },
              ].map(({ icon, text, fill }) => (
                <span key={text} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-white/65"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Icon name={icon} className="h-3.5 w-3.5 text-orange" fill={fill} />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Right: floating card */}
          <div className="relative hidden lg:flex justify-center">
            <div className="relative mx-auto max-w-sm animate-float">
              {/* Main card */}
              <div className="overflow-hidden rounded-3xl"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(24px)",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
                }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/stock/istockphoto-1434715649-612x612.jpg"
                  alt="Traveler delivering a parcel"
                  className="h-64 w-full object-cover"
                />
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-white/40">Kandy → Colombo</div>
                      <div className="mt-1 font-extrabold text-white">Small box · 1.5 kg</div>
                    </div>
                    <span className="rounded-full px-3 py-1 text-xs font-bold text-emerald-300"
                      style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
                      ✓ Delivered
                    </span>
                  </div>
                  <div className="mono mt-3 text-2xl font-bold text-emerald-400">LKR 500</div>
                </div>
              </div>

              {/* Float card: verified */}
              <div className="absolute -left-12 top-10 animate-float rounded-2xl px-4 py-3"
                style={{ animationDelay: "1s",
                  background: "rgba(15,23,42,0.85)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl text-teal-400"
                    style={{ background: "rgba(20,184,166,0.15)" }}>
                    <Icon name="check-circle" className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-xs text-white/40">Identity</div>
                    <div className="text-sm font-bold text-white">Verified</div>
                  </div>
                </div>
              </div>

              {/* Float card: earning */}
              <div className="absolute -right-10 bottom-16 animate-float rounded-2xl px-4 py-3"
                style={{ animationDelay: "2s",
                  background: "rgba(15,23,42,0.85)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl text-orange"
                    style={{ background: "rgba(255,107,53,0.15)" }}>
                    <Icon name="zap" className="h-4 w-4" fill="currentColor" />
                  </span>
                  <div>
                    <div className="text-xs text-white/40">You earned</div>
                    <div className="mono text-sm font-bold text-emerald-400">+LKR 450</div>
                  </div>
                </div>
              </div>

              {/* Float card: rating */}
              <div className="absolute -right-8 top-12 animate-bounce-gentle rounded-2xl px-4 py-3"
                style={{ animationDelay: "0.5s",
                  background: "rgba(15,23,42,0.85)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Icon key={i} name="star" className="h-3 w-3 text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <div className="mt-0.5 text-xs font-bold text-white">5.0 rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Stats bar ─── */}
        <div className="relative border-t"
          style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.2)", backdropFilter: "blur(12px)" }}>
          <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x px-4 py-6"
            style={{ divideColor: "rgba(255,255,255,0.08)" }}>
            <StatItem value={<Counter to={Math.max(stats.deliveries, 2400)} suffix="+" />} label="Deliveries" iconName="package" />
            <StatItem value={<Counter to={Math.max(stats.travelers,  850)} suffix="+" />} label="Travelers"  iconName="users" />
            <StatItem value={<Counter to={Math.max(stats.cities,      40)} suffix="+" />} label="Cities"     iconName="map-pin" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          FEATURES — Bento Grid
      ═══════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-24">
        <div className="text-center">
          <span className="section-label">Why ParcelBuddy</span>
          <h2 className="section-title mt-3">Built on trust<br className="hidden sm:block" /> and privacy</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Every feature is designed to protect you, verify carriers, and make money move at the speed of delivery.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon, title, desc, bg, color }) => (
            <div
              key={title}
              className="feature-card group relative overflow-hidden"
            >
              {/* Icon */}
              <div className="feature-icon" style={{ background: bg }}>
                <Icon name={icon} className="h-6 w-6" fill={icon === "star" ? "currentColor" : "none"}
                  style={{ color }} />
              </div>
              {/* Text */}
              <h3 className="mt-4 text-lg font-bold" style={{ color: "#0F172A" }}>{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{desc}</p>
              {/* Subtle corner accent */}
              <div className="feature-corner"
                style={{ background: `radial-gradient(circle at top right, ${bg}, transparent)` }} />
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════ */}
      <section className="relative overflow-hidden py-24" style={{ background: "#F4F4F5" }}>
        <div className="dot-grid-dark absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="text-center">
            <span className="section-label">How it works</span>
            <h2 className="section-title mt-3">Two ways to win</h2>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <HowColumn title="For Senders" badge="No account needed" steps={senderSteps} accent="orange" />
            <HowColumn title="For Travelers" badge="Earn on every trip" steps={travelerSteps} accent="violet" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          PRIVACY TRUST BAND
      ═══════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl px-8 py-16 text-center text-white"
          style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E1045 50%, #0F172A 100%)" }}>
          {/* Blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[10%] top-[20%] h-48 w-48 rounded-full blur-2xl opacity-40"
              style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />
            <div className="absolute right-[10%] bottom-[20%] h-48 w-48 rounded-full blur-2xl opacity-30"
              style={{ background: "radial-gradient(circle, #FF6B35, transparent)" }} />
          </div>
          <div className="dot-grid absolute inset-0 opacity-30" />

          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.3)" }}>
              <Icon name="lock" className="h-8 w-8 text-orange" />
            </div>
            <h3 className="text-3xl font-extrabold md:text-4xl">Your phone stays private</h3>
            <p className="mt-4 text-lg text-white/60">
              Your number is never shown publicly and never sold. It&apos;s shared only with
              your matched, verified traveler — and only after they accept.
            </p>
            <Link href="/send"
              className="mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #FF8A5B, #FF6B35, #E8420A)", boxShadow: "0 6px 24px rgba(255,107,53,0.4)" }}>
              <Icon name="box" className="h-5 w-5" />
              Send a Parcel Now
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          RECENT REQUESTS
      ═══════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 pb-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="section-label">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  style={{ background: "#FF6B35" }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "#FF6B35" }} />
              </span>
              Live now
            </span>
            <h2 className="section-title mt-2">Recent open requests</h2>
          </div>
          <Link href="/parcels" className="font-bold transition-colors hover:text-orange text-muted text-sm">
            View all →
          </Link>
        </div>
        {recent.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {recent.map((r) => (
              <ParcelCard key={r.id} request={r} href={`/parcels/${r.id}`} />
            ))}
          </div>
        ) : (
          <div className="card text-center text-muted py-12">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "rgba(255,107,53,0.08)" }}>
              <Icon name="package" className="h-7 w-7 text-orange" />
            </div>
            No open requests yet.{" "}
            <Link href="/send" className="font-bold text-orange hover:underline">Post the first one &rarr;</Link>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════
          COVERAGE
      ═══════════════════════════════════ */}
      <section className="py-16" style={{ background: "#F4F4F5" }}>
        <div className="mx-auto max-w-5xl px-4 text-center">
          <span className="section-label">Island-wide</span>
          <h3 className="section-title mt-3 text-2xl md:text-3xl">Coverage across Sri Lanka</h3>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {SRI_LANKAN_CITIES.map((c) => (
              <span key={c} className="chip">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          CTA BAND
      ═══════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-24">
        <div className="relative overflow-hidden rounded-3xl border p-12 text-center md:p-20"
          style={{ borderColor: "#E4E4E7", background: "white", boxShadow: "0 20px 80px rgba(15,23,42,0.06)" }}>
          {/* Corner gradients */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full blur-3xl opacity-20"
              style={{ background: "radial-gradient(circle, #FF6B35, transparent)" }} />
            <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full blur-3xl opacity-15"
              style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />
          </div>

          <div className="relative">
            <span className="section-label">Get started today</span>
            <h2 className="section-title mt-3">Ready to get moving?</h2>
            <p className="mx-auto mt-4 max-w-lg text-muted">
              Send a parcel in minutes, or start earning on your next trip.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/send"
                className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white transition-all hover:-translate-y-1"
                style={{ background: "linear-gradient(135deg, #FF8A5B, #FF6B35, #E8420A)", boxShadow: "0 6px 24px rgba(255,107,53,0.45)" }}>
                <Icon name="box" className="h-5 w-5" />
                Send a Parcel
              </Link>
              <Link href="/auth/register"
                className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white transition-all hover:-translate-y-1"
                style={{ background: "linear-gradient(135deg, #9461FB, #7C3AED)", boxShadow: "0 6px 24px rgba(124,58,237,0.4)" }}>
                <Icon name="car" className="h-5 w-5" />
                Become a Traveler
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function StatItem({ value, label, icon }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 text-center">
      <div className="text-2xl">{icon}</div>
      <div className="mono text-2xl font-bold text-white md:text-3xl">{value}</div>
      <div className="text-sm text-white/50">{label}</div>
    </div>
  );
}

function HowColumn({ title, badge, steps, accent }) {
  const accentColor = accent === "orange" ? "#FF6B35" : "#7C3AED";
  const accentBg    = accent === "orange" ? "rgba(255,107,53,0.1)" : "rgba(124,58,237,0.1)";
  const accentGrad  = accent === "orange"
    ? "linear-gradient(135deg, #FF8A5B, #FF6B35)"
    : "linear-gradient(135deg, #9461FB, #7C3AED)";

  return (
    <div className="card-premium">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold" style={{ color: "#0F172A" }}>{title}</h3>
        <span className="rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: accentBg, color: accentColor }}>
          {badge}
        </span>
      </div>

      {/* Steps */}
      <ol className="mt-7 space-y-5">
        {steps.map(([icon, t, d], i) => (
          <li key={i} className="flex gap-4">
            <div className="relative flex flex-col items-center">
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl text-white shadow-lg"
                style={{ background: accentGrad }}>
                <Icon name={icon} className="h-5 w-5" />
              </div>
              {i < steps.length - 1 && (
                <div className="mt-1 h-full w-px flex-1 rounded-full"
                  style={{ background: `linear-gradient(to bottom, ${accentColor}40, transparent)` }} />
              )}
            </div>
            <div className="pb-1">
              <div className="font-bold" style={{ color: "#0F172A" }}>{t}</div>
              <div className="mt-0.5 text-sm text-muted">{d}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

