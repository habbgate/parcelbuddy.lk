"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CitySelect from "@/components/CitySelect";
import ParcelCard from "@/components/ParcelCard";
import { api } from "@/lib/client";
import { PACKAGE_TYPES, PACKAGE_TYPE_LABELS } from "@/lib/constants";

export default function ParcelsPage() {
  const { data: session } = useSession();
  const [filters, setFilters] = useState({
    fromCity: "",
    toCity: "",
    packageType: "",
    minReward: "",
    maxWeight: "",
  });
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [alertSaved, setAlertSaved] = useState(false);

  const search = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && qs.set(k, v));
    qs.set("page", page.toString());
    try {
      const d = await api(`/api/requests?${qs.toString()}`);
      setResults(d.requests);
      setPagination(d.pagination);
    } catch {
      setResults([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleFilterChange = (updates) => {
    setFilters((f) => ({ ...f, ...updates }));
    setPage(1); // reset to page 1 on new filter
  };

  async function saveAlert() {
    if (!filters.fromCity || !filters.toCity) return;
    try {
      await api("/api/users/me/route-alerts", {
        method: "POST",
        body: { fromCity: filters.fromCity, toCity: filters.toCity },
      });
      setAlertSaved(true);
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-extrabold text-navy">Browse Open Jobs</h1>
        <p className="mt-1 text-muted">Find parcels heading your way and earn on the trip.</p>

        {/* Search */}
        <div className="card mt-6">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <CitySelect value={filters.fromCity} onChange={(v) => handleFilterChange({ fromCity: v })} placeholder="From city" />
            <CitySelect value={filters.toCity} onChange={(v) => handleFilterChange({ toCity: v })} placeholder="To city" />
            <button onClick={() => setPage(1)} className="btn-primary">Search</button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <select className="input" value={filters.packageType} onChange={(e) => handleFilterChange({ packageType: e.target.value })}>
              <option value="">Any package type</option>
              {PACKAGE_TYPES.map((t) => <option key={t} value={t}>{PACKAGE_TYPE_LABELS[t]}</option>)}
            </select>
            <input type="number" className="input" placeholder="Min reward (LKR)" value={filters.minReward} onChange={(e) => handleFilterChange({ minReward: e.target.value })} />
            <input type="number" className="input" placeholder="Max weight (kg)" value={filters.maxWeight} onChange={(e) => handleFilterChange({ maxWeight: e.target.value })} />
          </div>
        </div>

        {/* Results */}
        <div className="mt-6">
          {loading ? (
            <div className="py-16 text-center text-muted">Loading jobs…</div>
          ) : results.length ? (
            <>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {results.map((r) => (
                  <ParcelCard key={r.id} request={r} href={`/parcels/${r.id}`} />
                ))}
              </div>
              
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm font-medium text-gray-600">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <button 
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="card text-center">
              <div className="text-4xl">📭</div>
              <h3 className="mt-3 font-bold text-navy">No open jobs match your search</h3>
              <p className="mt-1 text-muted">Get notified when one is posted on this route.</p>
              {session ? (
                <button onClick={saveAlert} disabled={alertSaved || !filters.fromCity || !filters.toCity} className="btn-primary mt-4">
                  {alertSaved ? "🔔 Alert saved!" : "🔔 Alert me on this route"}
                </button>
              ) : (
                <p className="mt-4 text-sm text-muted">Log in to set a route alert.</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

