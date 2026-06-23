"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import { api } from "@/lib/client";

const NAVY = "#1A2B5F";
const ORANGE = "#F97316";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await api("/api/contact", { method: "POST", body: formData });
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-extrabold" style={{ color: NAVY }}>Contact Us</h1>
        <p className="mt-3 text-lg text-muted">
          Have a question or need help with a parcel? Our team is here for you.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Support block */}
          <div className="card p-6 border" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 mb-4" style={{ color: ORANGE }}>
              <Icon name="mail" className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold" style={{ color: NAVY }}>Email Support</h3>
            <p className="mt-2 text-muted text-sm">
              Send us an email and we&apos;ll get back to you within 24 hours.
            </p>
            <a href="mailto:support@parcelbuddy.lk" className="mt-4 inline-block font-semibold hover:underline" style={{ color: ORANGE }}>
              support@parcelbuddy.lk
            </a>
          </div>

          {/* Phone block */}
          <div className="card p-6 border" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 mb-4" style={{ color: ORANGE }}>
              <Icon name="phone" className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold" style={{ color: NAVY }}>Phone Support</h3>
            <p className="mt-2 text-muted text-sm">
              Available Monday to Friday, 9:00 AM - 6:00 PM (LKR).
            </p>
            <a href="tel:+94701111484" className="mt-4 inline-block font-semibold hover:underline" style={{ color: ORANGE }}>
              +94 70 111 1484
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card mt-10 border p-8 bg-white" style={{ borderColor: "#E2E8F0" }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: NAVY }}>Send us a message</h2>
          
          {status === "success" && (
            <div className="mb-6 rounded-xl bg-green-50 p-4 text-green-700 border border-green-200">
              Your message has been sent successfully. We will get back to you soon!
            </div>
          )}
          {status === "error" && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700 border border-red-200">
              Failed to send your message. Please try again later.
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Full Name</label>
                <input required type="text" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-gray-900" placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Email Address</label>
                <input required type="email" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-gray-900" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Subject</label>
              <input required type="text" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-gray-900" placeholder="How can we help?" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Message</label>
              <textarea required rows="4" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-gray-900" placeholder="Write your message here..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}></textarea>
            </div>
            <button disabled={loading} type="submit" className="w-full sm:w-auto inline-flex justify-center rounded-xl px-8 py-3 text-base font-bold text-white transition-all hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0" style={{ background: `linear-gradient(135deg, #FB923C, ${ORANGE}, #EA6C00)` }}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
