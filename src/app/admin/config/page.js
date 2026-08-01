"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { api } from "@/lib/client";

const FIELDS = [
  ["requestExpiryDays", "Request expiry (days)"],
  ["minRewardLKR", "Minimum reward (LKR)"],
  ["maxWeightKg", "Maximum weight (kg)"],
];

export default function AdminConfig() {
  const [config, setConfig] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/admin/config").then((d) => setConfig(d.config));
  }, []);

  async function save(e) {
    e.preventDefault();
    setError("");
    try {
      const body = Object.fromEntries(FIELDS.map(([k]) => [k, Number(config[k])]));
      const d = await api("/api/admin/config", { method: "PUT", body });
      setConfig(d.config);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e.message);
    }
  }

  if (!config) return <AdminShell><div className="py-16 text-center text-muted">Loading…</div></AdminShell>;

  return (
    <AdminShell>
      <h1 className="text-3xl font-extrabold text-navy">Platform Settings</h1>
      <form onSubmit={save} className="card mt-6 max-w-md space-y-4">
        {FIELDS.map(([key, label]) => (
          <div key={key}>
            <label className="label">{label}</label>
            <input type="number" step="any" className="input mono" value={config[key] ?? ""} onChange={(e) => setConfig((c) => ({ ...c, [key]: e.target.value }))} />
          </div>
        ))}
        {error && <p className="text-sm text-danger">{error}</p>}
        <button className="btn-primary">{saved ? "Saved!" : "Save settings"}</button>
      </form>
    </AdminShell>
  );
}

