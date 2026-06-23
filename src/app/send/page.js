"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CitySelect from "@/components/CitySelect";
import FileUpload from "@/components/FileUpload";
import Icon from "@/components/Icon";
import { api } from "@/lib/client";
import { PACKAGE_TYPES, PACKAGE_TYPE_LABELS } from "@/lib/constants";

const STEPS = ["Route", "Parcel", "Contact & Reward"];

export default function SendPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [suggestion, setSuggestion] = useState(null);

  const [form, setForm] = useState({
    fromCity: "",
    toCity: "",
    neededBy: "",
    description: "",
    weightKg: 1,
    packageType: "SMALL_BOX",
    isFragile: false,
    specialNotes: "",
    photos: [],
    name: "",
    phone: "",
    email: "",
    rewardLKR: "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Prefill contact details for logged-in users.
  useEffect(() => {
    let active = true;
    api("/api/users/me")
      .then((d) => {
        if (!active || !d.user) return;
        setForm((f) => ({
          ...f,
          name: f.name || d.user.name || "",
          phone: f.phone || d.user.phone || "",
          email: f.email || d.user.email || "",
        }));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Fetch suggested reward when both cities are chosen.
  useEffect(() => {
    if (form.fromCity && form.toCity) {
      api(`/api/suggest-reward?fromCity=${encodeURIComponent(form.fromCity)}&toCity=${encodeURIComponent(form.toCity)}`)
        .then((d) => setSuggestion(d.suggestion))
        .catch(() => setSuggestion(null));
    }
  }, [form.fromCity, form.toCity]);

  function validateStep() {
    setError("");
    if (step === 0) {
      if (!form.fromCity || !form.toCity) return "Please select both cities";
      if (form.fromCity === form.toCity) return "Cities must be different";
    }
    if (step === 1) {
      if (form.description.trim().length < 2) return "Describe what you're sending";
    }
    if (step === 2) {
      if (form.name.trim().length < 2) return "Your name is required";
      if (!/^(?:\+94|0)7\d{8}$/.test(form.phone)) return "Enter a valid SL mobile number";
      if (!form.rewardLKR || Number(form.rewardLKR) < 100) return "Minimum reward is LKR 100";
    }
    return null;
  }

  function next() {
    const e = validateStep();
    if (e) return setError(e);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function submit() {
    const e = validateStep();
    if (e) return setError(e);
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        route: {
          fromCity: form.fromCity,
          toCity: form.toCity,
          neededBy: form.neededBy ? new Date(form.neededBy).toISOString() : undefined,
        },
        parcel: {
          description: form.description,
          weightKg: Number(form.weightKg),
          packageType: form.packageType,
          isFragile: form.isFragile,
          specialNotes: form.specialNotes,
          photos: form.photos,
        },
        sender: { name: form.name, phone: form.phone, email: form.email },
        rewardLKR: Number(form.rewardLKR),
      };
      const res = await api("/api/requests", { method: "POST", body: payload });
      router.push(`/send/success?code=${res.trackingCode}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-extrabold text-navy">Send a Parcel</h1>
        <p className="mt-1 text-muted">No account needed. It takes about a minute.</p>

        {/* Stepper */}
        <div className="mt-6 flex items-center">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                    i <= step ? "bg-orange text-white" : "bg-border text-muted"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="mt-1 text-xs font-semibold text-muted">{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mx-2 h-1 flex-1 rounded ${i < step ? "bg-orange" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="card mt-6">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="label">From City *</label>
                <CitySelect value={form.fromCity} onChange={(v) => set("fromCity", v)} placeholder="Pickup city" />
              </div>
              <div>
                <label className="label">To City *</label>
                <CitySelect value={form.toCity} onChange={(v) => set("toCity", v)} placeholder="Destination city" />
              </div>
              <div>
                <label className="label">Needed By (optional)</label>
                <input type="date" className="input" value={form.neededBy} onChange={(e) => set("neededBy", e.target.value)} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="label">What are you sending? *</label>
                <input className="input" placeholder="e.g. Documents, clothes" value={form.description} onChange={(e) => set("description", e.target.value)} />
              </div>
              <div>
                <label className="label">Weight: {form.weightKg} kg</label>
                <input type="range" min="0.1" max="30" step="0.1" className="w-full accent-orange" value={form.weightKg} onChange={(e) => set("weightKg", e.target.value)} />
              </div>
              <div>
                <label className="label">Package Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  {PACKAGE_TYPES.map((t) => (
                    <button key={t} type="button" onClick={() => set("packageType", t)}
                      className={`rounded-lg border px-3 py-2 text-sm font-semibold ${form.packageType === t ? "border-orange bg-orange/10 text-orange" : "border-border text-muted"}`}>
                      {PACKAGE_TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 font-semibold text-navy">
                <input type="checkbox" className="h-5 w-5 accent-orange" checked={form.isFragile} onChange={(e) => set("isFragile", e.target.checked)} />
                This parcel is fragile
              </label>
              <div>
                <label className="label">Special notes (optional)</label>
                <textarea className="input" rows={3} value={form.specialNotes} onChange={(e) => set("specialNotes", e.target.value)} />
              </div>
              <div>
                <label className="label">Photos (optional, max 3)</label>
                <FileUpload folder="parcels" max={3} value={form.photos} onChange={(v) => set("photos", v)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="label">Your Name *</label>
                <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div>
                <label className="label">Your Phone *</label>
                <input className="input" placeholder="0771234567" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                <p className="mt-1 flex items-center gap-1.5 text-sm text-success"><Icon name="lock" className="h-4 w-4" /> Only shared with your matched traveler</p>
              </div>
              <div>
                <label className="label">Your Email (optional)</label>
                <input className="input" placeholder="For delivery status updates" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div>
                <label className="label">Reward in LKR *</label>
                <input type="number" className="input mono" placeholder="500" value={form.rewardLKR} onChange={(e) => set("rewardLKR", e.target.value)} />
                {suggestion && (
                  <p className="mt-1 text-sm text-muted">
                    Suggested: <span className="font-semibold text-navy">LKR {suggestion.low}–{suggestion.high}</span> (based on {suggestion.sampleSize} similar jobs)
                  </p>
                )}
              </div>
            </div>
          )}

          {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-danger">{error}</p>}

          <div className="mt-6 flex justify-between">
            <button className="btn-ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              ← Back
            </button>
            {step < STEPS.length - 1 ? (
              <button className="btn-primary" onClick={next}>Continue →</button>
            ) : (
              <button className="btn-primary" onClick={submit} disabled={submitting}>
                {submitting ? "Posting…" : "Post My Request →"}
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

