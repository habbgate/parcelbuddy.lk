import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NAVY = "#1A2B5F";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-extrabold" style={{ color: NAVY }}>Privacy Policy</h1>
        <p className="mt-3 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-10 space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: NAVY }}>1. Information We Collect</h2>
            <p>
              When you use ParcelBuddy, we collect information you provide directly to us, such as your name, email address,
              phone number, and identification documents (for travelers). We also collect data about your usage of the platform,
              such as the parcels you send, routes you travel, and transaction history.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: NAVY }}>2. How We Use Your Information</h2>
            <p>
              We use the information we collect to operate, maintain, and improve our services. Specifically, we use it to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Verify the identity of our travelers to ensure a safe community.</li>
              <li>Facilitate the matching of senders and travelers.</li>
              <li>Process transactions and send related information, including confirmations and receipts.</li>
              <li>Send you technical notices, updates, security alerts, and support messages.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: NAVY }}>3. Sharing of Information</h2>
            <p>
              Your privacy is our priority. We do not sell your personal information to third parties. We only share information as necessary to provide our services:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                <strong>Phone Privacy:</strong> A sender&apos;s phone number is never shown publicly. It is only shared with the
                single, verified traveler who has accepted the parcel delivery job.
              </li>
              <li>
                <strong>Legal Compliance:</strong> We may share information if required by law or to protect the rights and safety of our users.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: NAVY }}>4. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your personal information from unauthorized access, loss, or misuse.
              However, no data transmission over the internet can be guaranteed as 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: NAVY }}>5. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information. If you wish to delete your account or have any
              questions about our privacy practices, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: NAVY }}>6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@parcelbuddy.lk.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
