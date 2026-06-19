import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParcelCard from "@/components/ParcelCard";
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
    ["📝", "Post your parcel", "Fill a quick form — no signup needed."],
    ["🔔", "Get matched", "A verified traveler on your route accepts."],
    ["🤝", "Hand it over", "Their phone is shared so you can coordinate."],
    ["✅", "Confirm delivery", "Tap the SMS link once it arrives."],
  ];
  const travelerSteps = [
    ["🪪", "Verify your ID", "Upload your NIC or passport once."],
    ["🔍", "Find jobs", "Browse parcels going your way."],
    ["🚗", "Deliver", "Collect, travel, and drop it off."],
    ["💰", "Earn", "Get paid 90% of the reward, instantly."],
  ];

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
            Turn Your Journey Into Income
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80">
            ParcelBuddy connects people sending parcels with verified travelers
            heading the same way. Send affordably. Travel and earn.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/send" className="btn-primary w-full text-lg sm:w-auto">
              📦 Send a Parcel →
            </Link>
            <Link href="/parcels" className="btn-outline w-full text-lg sm:w-auto">
              🚗 Deliver &amp; Earn →
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
            <Stat value={`${stats.deliveries.toLocaleString()}+`} label="Deliveries" />
            <Stat value={`${stats.travelers.toLocaleString()}+`} label="Travelers" />
            <Stat value={`${stats.cities}+`} label="Cities" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-extrabold text-navy">How it Works</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <HowColumn title="For Senders" steps={senderSteps} accent="text-orange" />
          <HowColumn title="For Travelers" steps={travelerSteps} accent="text-success" />
        </div>
      </section>

      {/* Trust */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="text-5xl">🔒</div>
          <h3 className="mt-4 text-2xl font-extrabold text-navy">
            Your phone stays private
          </h3>
          <p className="mt-3 text-muted">
            Your phone number is only ever shared with your matched, verified
            traveler — never shown publicly, never sold.
          </p>
        </div>
      </section>

      {/* Recent requests */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-navy">Recent open requests</h2>
          <Link href="/parcels" className="font-semibold text-orange hover:underline">
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
          <div className="card text-center text-muted">
            No open requests yet. <Link href="/send" className="font-semibold text-orange">Post the first one →</Link>
          </div>
        )}
      </section>

      {/* Coverage */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h3 className="text-2xl font-extrabold text-navy">Coverage across Sri Lanka</h3>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {SRI_LANKAN_CITIES.map((c) => (
              <span key={c} className="rounded-full border border-border bg-bg px-3 py-1 text-sm text-muted">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="mono text-3xl font-bold text-orange">{value}</div>
      <div className="text-sm text-white/70">{label}</div>
    </div>
  );
}

function HowColumn({ title, steps, accent }) {
  return (
    <div className="card">
      <h3 className={`mb-6 text-xl font-extrabold ${accent}`}>{title}</h3>
      <ol className="space-y-5">
        {steps.map(([icon, t, d], i) => (
          <li key={i} className="flex gap-4">
            <div className="text-3xl">{icon}</div>
            <div>
              <div className="font-bold text-navy">{i + 1}. {t}</div>
              <div className="text-sm text-muted">{d}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
