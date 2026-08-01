import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";

const NAVY = "#1A2B5F";
const ORANGE = "#F97316";

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl font-extrabold" style={{ color: NAVY }}>How ParcelBuddy works</h1>
        <p className="mt-3 text-lg text-muted">
          We connect people who need to send a parcel with verified couriers
          already heading that way. Affordable for senders, income for couriers —
          paid in cash, no platform fee.
        </p>

        <Section
          title="For Senders"
          color={ORANGE}
          steps={[
            ["Post your parcel", "Register or log in, then fill a quick 3-step form. Set a reward you're happy to pay in cash."],
            ["Get a tracking code and PIN", "You instantly get a tracking code like PB-8X4K and a 4-digit delivery PIN."],
            ["A courier accepts", "Only then is your phone number shared — with that one verified courier."],
            ["Share your PIN", "When the parcel arrives, give the recipient's PIN to the courier to confirm delivery."],
          ]}
        />

        <Section
          title="For Couriers"
          color={NAVY}
          steps={[
            ["Register & verify", "Sign up and upload your NIC or passport once. Approved usually within 2 hours."],
            ["Find jobs on your route", "Browse open parcels or set a route alert to get notified."],
            ["Accept & coordinate", "Accept a job to reveal the sender's contact and arrange pickup."],
            ["Deliver & get paid cash", "Enter the delivery PIN from the recipient to confirm. Keep the full reward — no fee."],
          ]}
        />

        <div className="card mt-10 text-center" style={{ borderColor: "#E2E8F0" }}>
          <h3 className="text-xl font-extrabold" style={{ color: NAVY }}>Your privacy is the priority</h3>
          <p className="mt-2 text-muted">Sender phone numbers are never shown publicly. They are revealed only to the single verified courier who accepts the job.</p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/send" className="btn-primary">
              <Icon name="box" className="h-4 w-4" /> Send a Parcel
            </Link>
            <Link href="/auth/register" className="btn-outline">
              <Icon name="car" className="h-4 w-4" /> Become a Courier
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, color, steps }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-extrabold" style={{ color }}>{title}</h2>
      <ol className="mt-4 space-y-4">
        {steps.map(([t, d], i) => (
          <li key={i} className="card flex gap-4" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full font-bold text-white" style={{ background: color }}>{i + 1}</div>
            <div>
              <div className="font-bold" style={{ color: NAVY }}>{t}</div>
              <div className="text-sm text-muted">{d}</div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

