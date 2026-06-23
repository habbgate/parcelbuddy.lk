import Link from "next/link";
import { SRI_LANKAN_CITIES } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 mesh-hero text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="ParcelBuddy" className="h-9 w-9 rounded-xl" />
            <span className="text-lg font-extrabold text-white">
              Parcel<span className="text-orange">Buddy</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-white/60">
            Travel. Deliver. Earn. Turn your journey into income across Sri Lanka.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-bold text-white">Senders</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/send" className="hover:text-orange">Send a Parcel</Link></li>
            <li><Link href="/track" className="hover:text-orange">Track a Parcel</Link></li>
            <li><Link href="/how-it-works" className="hover:text-orange">How it Works</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-bold text-white">Travelers</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/auth/register" className="hover:text-orange">Become a Traveler</Link></li>
            <li><Link href="/parcels" className="hover:text-orange">Browse Jobs</Link></li>
            <li><Link href="/dashboard" className="hover:text-orange">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-bold text-white">Coverage</h4>
          <p className="text-sm leading-relaxed text-white/60">
            {SRI_LANKAN_CITIES.slice(0, 10).join(" · ")} &amp; 30+ more cities.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} ParcelBuddy. Your phone stays private — always.
      </div>
    </footer>
  );
}
