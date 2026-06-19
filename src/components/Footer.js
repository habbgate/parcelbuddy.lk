import Link from "next/link";
import { SRI_LANKAN_CITIES } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-navy text-white/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="mb-3 text-lg font-extrabold text-white">
            📦 Parcel<span className="text-orange">Buddy</span>
          </div>
          <p className="text-sm">Travel. Deliver. Earn. Turn your journey into income.</p>
        </div>
        <div>
          <h4 className="mb-3 font-bold text-white">Senders</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/send" className="hover:text-orange">Send a Parcel</Link></li>
            <li><Link href="/how-it-works" className="hover:text-orange">How it Works</Link></li>
            <li><Link href="/track" className="hover:text-orange">Track a Parcel</Link></li>
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
          <p className="text-sm leading-relaxed">
            {SRI_LANKAN_CITIES.slice(0, 12).join(" · ")} & more.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} ParcelBuddy. Your phone stays private — always.
      </div>
    </footer>
  );
}
