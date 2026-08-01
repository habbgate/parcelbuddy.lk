import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParcelCard from "@/components/ParcelCard";
import Counter from "@/components/Counter";
import Icon from "@/components/Icon";
import { fetchOpenRequests, fetchPlatformStats } from "@/lib/queries";
import { SRI_LANKAN_CITIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

const NAVY = "#1A2B5F";
const ORANGE = "#F97316";

async function getData() {
  try {
    const [recent, stats] = await Promise.all([
      fetchOpenRequests({ limit: 4 }),
      fetchPlatformStats(),
    ]);
    return { recent, stats };
  } catch {
    return { recent: [], stats: { deliveries: 0, couriers: 0, cities: 0 } };
  }
}

export default async function HomePage() {
  const { recent, stats } = await getData();

  const senderSteps = [
    ["pencil",       "Post your parcel",   "Create an account and fill a quick form."],
    ["bell",         "Get matched",        "A verified courier on your route accepts."],
    ["users",        "Hand it over",       "Their contact is shared so you can coordinate."],
    ["check-circle", "Share your PIN",     "The recipient gives the courier your 4-digit PIN to confirm delivery."],
  ];
  const courierSteps = [
    ["id-card",  "Verify your ID", "Upload your NIC or passport once."],
    ["search",   "Find jobs",      "Browse parcels going your way."],
    ["car",      "Deliver",        "Collect, travel, and drop it off."],
    ["wallet",   "Get paid cash",  "Collect the full reward in cash — no platform fee."],
  ];

  const features = [
    { icon: "lock",     title: "Phone stays private",        desc: "Your number is shared only with the one verified courier who accepts.", bg: "rgba(26,43,95,0.08)", color: NAVY },
    { icon: "shield",   title: "Verified couriers",          desc: "Every courier passes NIC/Passport identity checks before they can carry.", bg: "rgba(249,115,22,0.08)", color: ORANGE },
    { icon: "coins",    title: "Earn on trips you make",     desc: "Turn an empty seat or bag into income on your usual route.", bg: "rgba(26,43,95,0.08)", color: NAVY },
    { icon: "map-pin",  title: "Live tracking",              desc: "Follow every step — posted, matched, collected, in transit, delivered.", bg: "rgba(249,115,22,0.08)", color: ORANGE },
    { icon: "star",     title: "Ratings & reviews",          desc: "Build trust with a public profile and review history.", bg: "rgba(26,43,95,0.08)", color: NAVY },
    { icon: "check-circle", title: "Secure PIN delivery",    desc: "A 4-digit PIN confirms every handoff — no fee, cash paid directly.", bg: "rgba(249,115,22,0.08)", color: ORANGE },
  ];

  return (
    <>
      <Navbar />

      {/* ═══════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════ */}
      <section className="relative min-h-[92vh] overflow-hidden bg-white text-gray-900 flex flex-col">

        {/* Animated blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-blob-1 absolute left-[10%] top-[15%] h-96 w-96 rounded-full blur-3xl"
            style={{ background: `radial-gradient(circle, rgba(249,115,22,0.15), transparent 70%)` }} />
          <div className="animate-blob-2 absolute right-[8%] top-[10%] h-80 w-80 rounded-full blur-3xl"
            style={{ background: `radial-gradient(circle, rgba(26,43,95,0.1), transparent 70%)` }} />
          <div className="animate-blob-3 absolute bottom-[10%] left-[40%] h-72 w-72 rounded-full blur-3xl"
            style={{ background: `radial-gradient(circle, rgba(249,115,22,0.1), transparent 70%)` }} />
        </div>

        {/* Hero content */}
        <div className="relative flex-1 mx-auto grid max-w-7xl w-full items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">

          {/* Left: text */}
          <div className="animate-fade-up">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full px-4 py-2 bg-gray-50 border border-gray-200">
              <span className="flex h-5 w-5 items-center justify-center rounded-full"
                style={{ background: `linear-gradient(135deg, ${ORANGE}, #EA6C00)` }}>
                <Icon name="map-pin" className="h-3 w-3 text-white" fill="currentColor" />
              </span>
              <span className="text-sm font-semibold text-gray-600">Sri Lanka&apos;s #1 Community Delivery Network</span>
              <span className="ml-1 rounded-full px-2 py-0.5 text-xs font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${ORANGE}, #EA6C00)` }}>
                NEW
              </span>
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-6xl lg:text-7xl" style={{ color: NAVY }}>
              Turn Your<br />
              Journey Into{" "}
              <span className="relative">
                <span className="gradient-text">Income</span>
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-600">
              ParcelBuddy connects people sending parcels with <strong style={{ color: NAVY }}>verified couriers</strong> heading
              the same way. Send affordably. Travel and earn cash.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/send"
                className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl px-7 py-4 text-base font-bold text-white transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: `linear-gradient(135deg, #FB923C 0%, ${ORANGE} 60%, #EA6C00 100%)`,
                  boxShadow: "0 6px 24px rgba(249,115,22,0.3), 0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <span className="relative flex items-center gap-2">
                  <Icon name="box" className="h-5 w-5" />
                  Send a Parcel
                </span>
              </Link>

              <Link
                href="/parcels"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border-2 px-7 py-4 text-base font-bold transition-all duration-300 hover:-translate-y-1 bg-white hover:bg-gray-50"
                style={{
                  borderColor: NAVY,
                  color: NAVY
                }}
              >
                <Icon name="car" className="h-5 w-5" style={{ color: ORANGE }} />
                Deliver &amp; Earn
              </Link>
            </div>

            {/* Trust pills */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {[
                { icon: "star", text: "4.9 avg rating", fill: "currentColor" },
                { icon: "lock", text: "Phone-private" },
                { icon: "zap",  text: "Cash payments" },
              ].map(({ icon, text, fill }) => (
                <span key={text} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200">
                  <Icon name={icon} className="h-3.5 w-3.5" style={{ color: ORANGE }} fill={fill} />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Right: floating card */}
          <div className="relative hidden lg:flex justify-center">
            <div className="relative mx-auto max-w-sm animate-float">
              {/* Main card */}
              <div className="overflow-hidden rounded-3xl bg-white"
                style={{
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 32px 80px rgba(26,43,95,0.1)",
                }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/stock/istockphoto-1434715649-612x612.jpg"
                  alt="Courier delivering a parcel"
                  className="h-64 w-full object-cover"
                />
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">Kandy → Colombo</div>
                      <div className="mt-1 font-extrabold" style={{ color: NAVY }}>Small box · 1.5 kg</div>
                    </div>
                    <span className="rounded-full px-3 py-1 text-xs font-bold text-green-700 bg-green-50 border border-green-200">
                      ✓ Delivered
                    </span>
                  </div>
                  <div className="mono mt-3 text-2xl font-bold" style={{ color: ORANGE }}>LKR 500</div>
                </div>
              </div>

              {/* Float card: verified */}
              <div className="absolute -left-12 top-10 animate-float rounded-2xl px-4 py-3 bg-white"
                style={{ animationDelay: "1s", border: "1px solid #E2E8F0", boxShadow: "0 8px 32px rgba(26,43,95,0.08)" }}>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ background: "rgba(26,43,95,0.08)", color: NAVY }}>
                    <Icon name="check-circle" className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-xs text-gray-400">Identity</div>
                    <div className="text-sm font-bold" style={{ color: NAVY }}>Verified</div>
                  </div>
                </div>
              </div>

              {/* Float card: earning */}
              <div className="absolute -right-10 bottom-16 animate-float rounded-2xl px-4 py-3 bg-white"
                style={{ animationDelay: "2s", border: "1px solid #E2E8F0", boxShadow: "0 8px 32px rgba(26,43,95,0.08)" }}>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ background: "rgba(249,115,22,0.1)", color: ORANGE }}>
                    <Icon name="zap" className="h-4 w-4" fill="currentColor" />
                  </span>
                  <div>
                    <div className="text-xs text-gray-400">You earned (cash)</div>
                    <div className="mono text-sm font-bold" style={{ color: ORANGE }}>+LKR 500</div>
                  </div>
                </div>
              </div>

              {/* Float card: rating */}
              <div className="absolute -right-8 top-12 animate-bounce-gentle rounded-2xl px-4 py-3 bg-white"
                style={{ animationDelay: "0.5s", border: "1px solid #E2E8F0", boxShadow: "0 8px 32px rgba(26,43,95,0.08)" }}>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Icon key={i} name="star" className="h-3 w-3 text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <div className="mt-0.5 text-xs font-bold" style={{ color: NAVY }}>5.0 rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Stats bar ─── */}
        <div className="relative border-t"
          style={{ borderColor: "#E2E8F0", background: "white" }}>
          <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x px-4 py-6"
            style={{ divideColor: "#E2E8F0" }}>
            <StatItem value={<Counter to={Math.max(stats.deliveries, 2400)} suffix="+" />} label="Deliveries" iconName="package" />
            <StatItem value={<Counter to={Math.max(stats.couriers,  850)} suffix="+" />} label="Couriers"  iconName="users" />
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
              className="feature-card group relative overflow-hidden bg-white border"
              style={{ borderColor: "#E2E8F0", borderRadius: "1.5rem", padding: "1.5rem" }}
            >
              {/* Icon */}
              <div className="feature-icon" style={{ background: bg }}>
                <Icon name={icon} className="h-6 w-6" fill={icon === "star" ? "currentColor" : "none"}
                  style={{ color }} />
              </div>
              {/* Text */}
              <h3 className="mt-4 text-lg font-bold" style={{ color: NAVY }}>{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════ */}
      <section className="relative overflow-hidden py-24 bg-gray-50">
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="text-center">
            <span className="section-label">How it works</span>
            <h2 className="section-title mt-3">Two ways to win</h2>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <HowColumn title="For Senders" badge="Cash payments" steps={senderSteps} accent="orange" />
            <HowColumn title="For Couriers" badge="Earn on every trip" steps={courierSteps} accent="navy" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          PRIVACY TRUST BAND
      ═══════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl px-8 py-16 text-center text-white"
          style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0F1A3A 50%, ${NAVY} 100%)` }}>
          {/* Blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[10%] top-[20%] h-48 w-48 rounded-full blur-3xl opacity-20"
              style={{ background: `radial-gradient(circle, ${ORANGE}, transparent)` }} />
            <div className="absolute right-[10%] bottom-[20%] h-48 w-48 rounded-full blur-3xl opacity-20"
              style={{ background: `radial-gradient(circle, white, transparent)` }} />
          </div>

          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)" }}>
              <Icon name="lock" className="h-8 w-8" style={{ color: ORANGE }} />
            </div>
            <h3 className="text-3xl font-extrabold md:text-4xl">Your phone stays private</h3>
            <p className="mt-4 text-lg text-white/70">
              Your number is never shown publicly and never sold. It&apos;s shared only with
              your matched, verified courier — and only after they accept.
            </p>
            <Link href="/send"
              className="mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: `linear-gradient(135deg, #FB923C, ${ORANGE}, #EA6C00)`, boxShadow: "0 6px 24px rgba(249,115,22,0.35)" }}>
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
                  style={{ background: ORANGE }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: ORANGE }} />
              </span>
              Live now
            </span>
            <h2 className="section-title mt-2">Recent open requests</h2>
          </div>
          <Link href="/parcels" className="font-bold transition-colors hover:text-orange text-muted text-sm" style={{ color: ORANGE }}>
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
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "rgba(249,115,22,0.08)" }}>
              <Icon name="package" className="h-7 w-7" style={{ color: ORANGE }} />
            </div>
            No open requests yet.{" "}
            <Link href="/send" className="font-bold hover:underline" style={{ color: ORANGE }}>Post the first one &rarr;</Link>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════
          COVERAGE
      ═══════════════════════════════════ */}
      <section className="py-16 bg-gray-50">
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
        <div className="relative overflow-hidden rounded-3xl border p-12 text-center md:p-20 bg-white"
          style={{ borderColor: "#E2E8F0", boxShadow: "0 20px 80px rgba(26,43,95,0.06)" }}>
          {/* Corner gradients */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full blur-3xl opacity-10"
              style={{ background: `radial-gradient(circle, ${ORANGE}, transparent)` }} />
            <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full blur-3xl opacity-10"
              style={{ background: `radial-gradient(circle, ${NAVY}, transparent)` }} />
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
                style={{ background: `linear-gradient(135deg, #FB923C, ${ORANGE}, #EA6C00)`, boxShadow: "0 6px 24px rgba(249,115,22,0.35)" }}>
                <Icon name="box" className="h-5 w-5" />
                Send a Parcel
              </Link>
              <Link href="/auth/register"
                className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white transition-all hover:-translate-y-1"
                style={{ background: `linear-gradient(135deg, #243474, ${NAVY})`, boxShadow: "0 6px 24px rgba(26,43,95,0.3)" }}>
                <Icon name="car" className="h-5 w-5" />
                Become a Courier
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function StatItem({ value, label, iconName }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 text-center">
      <div className="text-2xl text-gray-400"><Icon name={iconName} className="h-6 w-6" /></div>
      <div className="mono text-2xl font-bold md:text-3xl" style={{ color: NAVY }}>{value}</div>
      <div className="text-sm text-muted">{label}</div>
    </div>
  );
}

function HowColumn({ title, badge, steps, accent }) {
  const accentColor = accent === "orange" ? ORANGE : NAVY;
  const accentBg    = accent === "orange" ? "rgba(249,115,22,0.1)" : "rgba(26,43,95,0.1)";
  const accentGrad  = accent === "orange"
    ? `linear-gradient(135deg, #FB923C, ${ORANGE})`
    : `linear-gradient(135deg, #243474, ${NAVY})`;

  return (
    <div className="card-premium bg-white border" style={{ borderColor: "#E2E8F0" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold" style={{ color: NAVY }}>{title}</h3>
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
              <div className="font-bold" style={{ color: NAVY }}>{t}</div>
              <div className="mt-0.5 text-sm text-muted">{d}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
