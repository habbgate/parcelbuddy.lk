import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NAVY = "#1A2B5F";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-extrabold" style={{ color: NAVY }}>Terms of Service</h1>
        <p className="mt-3 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-10 space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: NAVY }}>1. Introduction</h2>
            <p>
              Welcome to ParcelBuddy. By accessing our website and using our services, you agree to be bound by these Terms of Service.
              Please read them carefully. ParcelBuddy provides a platform that connects people who want to send parcels with verified
              travelers heading in the same direction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: NAVY }}>2. User Responsibilities</h2>
            <p>
              As a user of our platform, whether a sender or a traveler, you agree to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Provide accurate, current, and complete information during registration.</li>
              <li>Maintain the security of your account credentials.</li>
              <li>Comply with all applicable laws and regulations in Sri Lanka regarding the transport of goods.</li>
              <li>Not send or transport prohibited, illegal, or hazardous items.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: NAVY }}>3. Prohibited Items</h2>
            <p>
              Users are strictly prohibited from sending or carrying any items that are illegal, dangerous, or restricted under Sri Lankan law.
              This includes, but is not limited to: explosives, firearms, illegal drugs, hazardous chemicals, and perishable goods without proper packaging.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: NAVY }}>4. Payments & Fees</h2>
            <p>
              ParcelBuddy facilitates payments between senders and travelers. The sender agrees to pay the agreed-upon reward for the delivery.
              ParcelBuddy deducts a standard platform fee (e.g., 10%) from the total reward, and the remaining amount (e.g., 90%) is transferred
              to the traveler&apos;s wallet upon confirmed delivery.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: NAVY }}>5. Limitation of Liability</h2>
            <p>
              ParcelBuddy acts merely as a connection platform. We do not take possession of any parcels and are not liable for lost, damaged,
              or stolen items. Users assume all risks associated with sending and carrying parcels. However, we do enforce identity verification
              for all travelers to maintain a trusted community.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: NAVY }}>6. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at support@parcelbuddy.lk.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
