"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import FileUpload from "@/components/FileUpload";
import Icon from "@/components/Icon";
import { api } from "@/lib/client";
import { DOC_TYPES } from "@/lib/constants";

const DOC_LABELS = { NIC: "NIC", PASSPORT: "Passport", DRIVING_LICENSE: "Driving License" };

export default function VerifyIdentityPage() {
  const { status: authStatus, update } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState("NIC");
  const [front, setFront] = useState([]);
  const [back, setBack] = useState([]);
  const [selfie, setSelfie] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [current, setCurrent] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/auth/login?callbackUrl=/verify-identity");
    if (authStatus === "authenticated") {
      api("/api/users/me").then((d) => setCurrent(d.user)).catch(() => {});
    }
  }, [authStatus, router]);

  async function submit() {
    setBusy(true);
    setError("");
    try {
      await api("/api/users/verify-id", {
        method: "POST",
        body: {
          docType,
          frontUrl: front[0],
          backUrl: back[0] || "",
          selfieUrl: selfie[0] || "",
        },
      });
      setSubmitted(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (submitted || current?.idVerification?.status === "PENDING") {
    return (
      <Shell>
        <div className="card text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber/10 text-amber"><Icon name="clock" className="h-8 w-8" /></div>
          <h1 className="mt-4 text-2xl font-extrabold text-navy">Under review</h1>
          <p className="mt-2 text-muted">Usually approved within 2 hours. We&apos;ll SMS you once it&apos;s done.</p>
        </div>
      </Shell>
    );
  }

  if (current?.status === "ACTIVE") {
    return (
      <Shell>
        <div className="card text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success"><Icon name="check-circle" className="h-8 w-8" /></div>
          <h1 className="mt-4 text-2xl font-extrabold text-navy">You&apos;re verified!</h1>
          <button onClick={() => router.push("/parcels")} className="btn-primary mt-4">Browse jobs</button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 className="text-3xl font-extrabold text-navy">Verify your identity</h1>
      <p className="mt-1 text-muted">Required once before you can accept jobs.</p>
      {current?.idVerification?.status === "REJECTED" && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-danger">
          Previous submission rejected: {current.idVerification.rejectionReason}
        </p>
      )}

      <div className="card mt-6 space-y-6">
        {step === 1 && (
          <div>
            <h3 className="font-bold text-navy">Step 1: Document type</h3>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {DOC_TYPES.map((t) => (
                <button key={t} onClick={() => setDocType(t)}
                  className={`rounded-lg border px-3 py-3 text-sm font-semibold ${docType === t ? "border-orange bg-orange/10 text-orange" : "border-border text-muted"}`}>
                  {DOC_LABELS[t]}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="btn-primary mt-4">Continue →</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-bold text-navy">Step 2: Upload your document</h3>
            <div>
              <label className="label">Front *</label>
              <FileUpload folder="id-docs" max={1} value={front} onChange={setFront} label="Upload front of document" />
            </div>
            <div>
              <label className="label">Back (optional)</label>
              <FileUpload folder="id-docs" max={1} value={back} onChange={setBack} label="Upload back of document" />
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="btn-ghost">← Back</button>
              <button onClick={() => setStep(3)} disabled={!front[0]} className="btn-primary">Continue →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold text-navy">Step 3: Selfie with document (optional)</h3>
            <FileUpload folder="id-docs" max={1} value={selfie} onChange={setSelfie} label="Upload a selfie holding your document" />
            {error && <p className="text-sm font-semibold text-danger">{error}</p>}
            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="btn-ghost">← Back</button>
              <button onClick={submit} disabled={busy || !front[0]} className="btn-primary">
                {busy ? "Submitting…" : "Submit for review"}
              </button>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-10">{children}</main>
    </>
  );
}

