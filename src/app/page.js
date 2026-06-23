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
    ["pencil", "Post your parcel", "Fill a quick form — no signup needed."],
    ["bell", "Get matched", "A verified traveler on your route accepts."],
    ["users", "Hand it over", "Their contact is shared so you can coordinate."],
    ["check-circle", "Confirm delivery", "Tap the SMS link once it arrives."],
  ];
  const travelerSteps = [
    ["id-card", "Verify your ID", "Upload your NIC or passport once."],
    ["search", "Find jobs", "Browse parcels going your way."],
    ["car", "Deliver", "Collect, travel, and drop it off."],
    ["wallet", "Earn", "Get paid 90% of the reward, instantly."],
  ];

  const features = [
    ["lock", "Phone stays private", "Your number is shared only with the one verified traveler who accepts."],
    ["shield", "Verified travelers", "Every traveler passes NIC/Passport identity checks before they can carry."],
    ["coins", "Earn on trips you already make", "Turn an empty seat or bag into income on your usual route."],
    ["map-pin", "Live tracking", "Follow every step — posted, matched, collected, in transit, delivered."],
    ["star", "Ratings & reviews", "Build trust with a public profile and review history."],
    ["zap", "Instant payouts", "90% of the reward lands in your wallet the moment delivery is confirmed."],
  ];

  return (
    <>
      <Navbar />

      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden mesh-hero text-white">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
          <div className="animate-fade-up">
            <span className="chip !border-white/20 !bg-white/10 !text-white backdrop-blur">
              <Icon name="flag" className="h-4 w-4" /> Sri Lanka&apos;s community delivery network
            </span>
            <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
              Turn Your Journey <br />
              Into <span className="gradient-text">Income</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-white/75">
              ParcelBuddy connects people sending parcels with verified travelers
              heading the same way. Send affordably. Travel and earn.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/send" className="btn-primary text-base">
                <Icon name="box" className="h-5 w-5" /> Send a Parcel
              </Link>
              <Link href="/parcels" className="btn-outline !bg-white/10 !text-white !border-white/25 text-base hover:!bg-white/20 hover:!text-white">
                <Icon name="car" className="h-5 w-5" /> Deliver &amp; Earn
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-white/60">
              <span className="flex items-center gap-1.5"><Icon name="star" className="h-4 w-4" fill="currentColor" /> 4.9 avg rating</span>
              <span className="flex items-center gap-1.5"><Icon name="lock" className="h-4 w-4" /> Phone-private</span>
              <span className="flex items-center gap-1.5"><Icon name="zap" className="h-4 w-4" /> Instant payouts</span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative hidden lg:block">
            <div className="relative mx-auto max-w-md animate-float">
              <div className="card-glass overflow-hidden !p-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/stock/istockphoto-1434715649-612x612.jpg"
                  alt="Traveler delivering a parcel"
                  className="h-72 w-full object-cover"
                />
                <div className="bg-white p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase text-muted">Kandy → Colombo</div>
                      <div className="font-extrabold text-navy">Small box · 1.5 kg</div>
                    </div>
                    <span className="badge badge-green">Delivered</span>
                  </div>
                  <div className="mono mt-3 text-2xl font-bold text-success">LKR 500</div>
                </div>
              </div>
              {/* floating mini cards */}
              <div className="absolute -left-10 top-6 rounded-2xl bg-white p-3 shadow-xl shadow-navy/20 animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/15 text-success"><Icon name="check-circle" /></span>
                  <div>
                    <div className="text-xs text-muted">Identity</div>
                    <div className="text-sm font-bold text-navy">Verified</div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-8 bottom-10 rounded-2xl bg-white p-3 shadow-xl shadow-navy/20 animate-float" style={{ animationDelay: "2s" }}>
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange/15 text-orange"><Icon name="wallet" /></span>
                  <div>
                    <div className="text-xs text-muted">You earned</div>
                    <div className="mono text-sm font-bold text-success">+LKR 450</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* stats bar */}
        <div className="relative border-t border-white/10 bg-white/5 backdrop-blur">
          <div className="mx-auto grid max-w-6xl grid-cols-3 gap-4 px-4 py-7">
            <Stat value={<Counter to={Math.max(stats.deliveries, 2400)} suffix="+" />} label="Deliveries" />
            <Stat value={<Counter to={Math.max(stats.travelers, 850)} suffix="+" />} label="Travelers" />
            <Stat value={<Counter to={Math.max(stats.cities, 40)} suffix="+" />} label="Cities" />
          </div>
        </div>
      </section>

      {/* ───────── Features ───────── */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <span className="chip">Why ParcelBuddy</span>
          <h2 className="mt-4 text-3xl font-extrabold text-navy md:text-4xl">Built on trust and privacy</h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([icon, title, desc]) => (
            <div key={title} className="card group hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/5 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange/10 text-orange transition group-hover:scale-110">
                <Icon name={icon} className="h-6 w-6" fill={icon === "star" ? "currentColor" : "none"} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-navy">{title}</h3>
              <p className="mt-1.5 text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── How it works ───────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <span className="chip">How it works</span>
            <h2 className="mt-4 text-3xl font-extrabold text-navy md:text-4xl">Two ways to win</h2>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <HowColumn title="For Senders" badge="No account needed" steps={senderSteps} accent="orange" />
            <HowColumn title="For Travelers" badge="Earn on every trip" steps={travelerSteps} accent="success" />
          </div>
        </div>
      </section>

      {/* ───────── Trust band ───────── */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mesh-hero relative overflow-hidden rounded-3xl px-8 py-14 text-center text-white">
          <div className="absolute inset-0 dot-grid opacity-50" />
          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <Icon name="lock" className="h-8 w-8 text-orange" />
            </div>
            <h3 className="mt-5 text-3xl font-extrabold">Your phone stays private</h3>
            <p className="mt-3 text-white/75">
              Your number is never shown publicly and never sold. It&apos;s shared only with
              your matched, verified traveler — and only after they accept.
            </p>
          </div>
        </div>
      </section>

      {/* ───────── Recent requests ───────── */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="chip">Live now</span>
            <h2 className="mt-3 text-3xl font-extrabold text-navy">Recent open requests</h2>
          </div>
          <Link href="/parcels" className="font-semibold text-orange hover:underline">View all →</Link>
        </div>
        {recent.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {recent.map((r) => (
              <ParcelCard key={r.id} request={r} href={`/parcels/${r.id}`} />
            ))}
          </div>
        ) : (
          <div className="card text-center text-muted">
            No open requests yet. <Link href="/send" className="font-semibold text-orange">Post the first one →</Link>
          </div>
        )}
      </section>

      {/* ───────── Coverage ───────── */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <span className="chip">Island-wide</span>
          <h3 className="mt-4 text-2xl font-extrabold text-navy">Coverage across Sri Lanka</h3>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {SRI_LANKAN_CITIES.map((c) => (
              <span key={c} className="chip">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-3xl border border-border bg-white p-10 text-center shadow-xl shadow-navy/5 md:p-16">
          <h2 className="text-3xl font-extrabold text-navy md:text-4xl">Ready to get moving?</h2>
          <p className="mt-3 text-muted">Send a parcel in a minute, or start earning on your next trip.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/send" className="btn-primary text-base">
              <Icon name="box" className="h-5 w-5" /> Send a Parcel
            </Link>
            <Link href="/auth/register" className="btn-navy text-base">
              <Icon name="car" className="h-5 w-5" /> Become a Traveler
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Stat({ value, label }) {
  return (
    <div className="text-center">
      <div className="mono text-3xl font-bold text-orange md:text-4xl">{value}</div>
      <div className="text-sm text-white/70">{label}</div>
    </div>
  );
}

function HowColumn({ title, badge, steps, accent }) {
  const accentBg = accent === "orange" ? "bg-orange" : "bg-success";
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-navy">{title}</h3>
        <span className={`badge ${accent === "orange" ? "badge-orange" : "badge-green"}`}>{badge}</span>
      </div>
      <ol className="mt-6 space-y-5">
        {steps.map(([icon, t, d], i) => (
          <li key={i} className="flex gap-4">
            <div className="relative flex flex-col items-center">
              <div className={`flex h-11 w-11 flex-none items-center justify-center rounded-2xl ${accentBg} text-white shadow-lg`}>
                <Icon name={icon} className="h-5 w-5" />
              </div>
              {i < steps.length - 1 && <div className="mt-1 h-full w-px flex-1 bg-border" />}
            </div>
            <div className="pb-1">
              <div className="font-bold text-navy">{t}</div>
              <div className="text-sm text-muted">{d}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
