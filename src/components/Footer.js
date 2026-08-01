"use client";

import Link from "next/link";
import { SRI_LANKAN_CITIES } from "@/lib/constants";
import Icon from "@/components/Icon";

const SOCIAL = [
  { name: "Facebook",  href: "#", color: "#1877F2" },
  { name: "Instagram", href: "#", color: "#E1306C" },
  { name: "Twitter",   href: "#", color: "#1DA1F2" },
  { name: "LinkedIn",  href: "#", color: "#0A66C2" },
];

const LINKS_SENDERS = [
  ["/send",        "Send a Parcel"],
  ["/track",       "Track a Parcel"],
  ["/how-it-works","How it Works"],
];

const LINKS_COURIERS = [
  ["/auth/register", "Become a Courier"],
  ["/parcels",       "Browse Jobs"],
  ["/dashboard",     "My Dashboard"],
  ["/verify-identity","Verify Identity"],
];

const LINKS_COMPANY = [
  ["/privacy", "Privacy Policy"],
  ["/terms", "Terms of Service"],
  ["/contact", "Contact Us"],
];

const TRUST_BADGES = [
  {
    label: "Phone Private",
    desc: "Never shared publicly",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
  {
    label: "ID Verified",
    desc: "Every courier checked",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
  {
    label: "Cash Payment",
    desc: "No platform fee",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
];

const NAVY   = "#1A2B5F";
const ORANGE = "#F97316";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-white border-t" style={{ borderColor: "#E2E8F0" }}>
      {/* ─── Decorative blobs ─── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-10 blur-3xl"
          style={{ background: `radial-gradient(circle, ${ORANGE}, transparent)` }} />
        <div className="absolute -right-20 top-20 h-72 w-72 rounded-full opacity-5 blur-3xl"
          style={{ background: `radial-gradient(circle, ${NAVY}, transparent)` }} />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full opacity-10 blur-3xl"
          style={{ background: `radial-gradient(circle, ${ORANGE}, transparent)` }} />
      </div>

      {/* ─── Trust badges strip ─── */}
      <div className="relative border-b" style={{ borderColor: "#F1F5F9" }}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 py-7 sm:flex-row sm:gap-10">
          {TRUST_BADGES.map(({ icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: "rgba(26,43,95,0.05)", border: "1px solid rgba(26,43,95,0.1)", color: NAVY }}>
                {icon}
              </span>
              <div>
                <div className="text-sm font-bold" style={{ color: NAVY }}>{label}</div>
                <div className="text-xs text-gray-500">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Main footer grid ─── */}
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-5">

        {/* Brand column (spans 2 on lg) */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ParcelBuddy"
              className="h-14 w-14 object-contain rounded-full"
              style={{ background: "white", padding: "2px", border: "1px solid #E2E8F0" }} />
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-extrabold" style={{ color: NAVY }}>
                Parcel<span style={{ color: ORANGE }}>Buddy</span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: ORANGE }}>Sri Lanka</span>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-600">
            Sri Lanka&apos;s community-powered parcel delivery network. Travel. Deliver. Earn cash. Turn
            every journey into income — safely.
          </p>

          {/* Social icons */}
          <div className="mt-6 flex items-center gap-2">
            {SOCIAL.map(({ name }) => (
              <a
                key={name}
                href="#"
                aria-label={name}
                className="group flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 hover:-translate-y-0.5 bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-gray-100"
              >
                <SocialIcon name={name} />
              </a>
            ))}
          </div>

          {/* Newsletter */}
          <div className="mt-7">
            <p className="mb-2.5 text-sm font-semibold" style={{ color: NAVY }}>Get delivery updates</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-all placeholder:text-gray-400 bg-gray-50 border border-gray-200 text-gray-900"
                onFocus={e => { e.target.style.borderColor = ORANGE; e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
              />
              <button
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg, #FB923C, ${ORANGE}, #EA6C00)`,
                  boxShadow: "0 4px 16px rgba(249,115,22,0.3)",
                }}
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Senders */}
        <div>
          <h4 className="mb-5 text-xs font-bold uppercase tracking-widest" style={{ color: ORANGE }}>
            Senders
          </h4>
          <ul className="space-y-3">
            {LINKS_SENDERS.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-sm text-gray-500 transition-all duration-200 hover:text-gray-900 inline-block font-medium">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Couriers */}
        <div>
          <h4 className="mb-5 text-xs font-bold uppercase tracking-widest" style={{ color: ORANGE }}>
            Couriers
          </h4>
          <ul className="space-y-3">
            {LINKS_COURIERS.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-sm text-gray-500 transition-all duration-200 hover:text-gray-900 inline-block font-medium">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company + Coverage */}
        <div>
          <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-gray-400">
            Company
          </h4>
          <ul className="space-y-3">
            {LINKS_COMPANY.map(([href, label]) => (
              <li key={label}>
                <Link href={href} className="text-sm text-gray-500 transition-all duration-200 hover:text-gray-900 inline-block font-medium">
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mini coverage */}
          <div className="mt-7">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: ORANGE }}>
              Coverage
            </h4>
            <p className="text-xs leading-relaxed text-gray-500">
              {SRI_LANKAN_CITIES.slice(0, 8).join(" · ")} &amp; 30+ more cities.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Bottom bar ─── */}
      <div className="relative border-t px-4 py-5" style={{ borderColor: "#F1F5F9" }}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-gray-400 sm:flex-row font-medium">
          <span>© {new Date().getFullYear()} ParcelBuddy by <a href="https://www.habb.lk" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors underline decoration-gray-300 underline-offset-2">HABB Pvt Ltd</a>. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
            <span className="text-gray-300">|</span>
            <span style={{ color: NAVY }}>Made in Sri Lanka</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }) {
  const icons = {
    Facebook: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-400 group-hover:text-[#1877F2] transition-colors" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
    Instagram: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-400 group-hover:text-[#E1306C] transition-colors" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
      </svg>
    ),
    Twitter: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-400 group-hover:text-[#1DA1F2] transition-colors" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    LinkedIn: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-400 group-hover:text-[#0A66C2] transition-colors" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  };
  return icons[name] || null;
}
