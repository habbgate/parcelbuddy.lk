"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/client";
import { formatLKR, formatDate } from "@/lib/format";

export default function WalletPage() {
  const { status: authStatus } = useSession();
  const router = useRouter();
  const [wallet, setWallet] = useState(null);
  const [txns, setTxns] = useState([]);

  async function load() {
    const d = await api("/api/users/me/wallet");
    setWallet(d.wallet);
    setTxns(d.transactions);
  }

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/auth/login?callbackUrl=/wallet");
    if (authStatus === "authenticated") load();
  }, [authStatus, router]);

  async function withdraw() {
    const amount = Number(prompt(`Withdraw amount (max ${wallet.balance})`));
    if (!amount) return;
    try {
      await api("/api/users/me/wallet/withdraw", { method: "POST", body: { amountLKR: amount } });
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  if (!wallet) return <><Navbar /><div className="py-20 text-center text-muted">Loading…</div></>;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-3xl font-extrabold text-navy">Wallet</h1>

        <div className="card mt-6 bg-navy text-white">
          <div className="text-xs uppercase text-white/70">Available balance</div>
          <div className="mono mt-1 text-4xl font-bold text-orange">{formatLKR(wallet.balance)}</div>
          <div className="mt-3 flex gap-6 text-sm text-white/80">
            <span>Earned: {formatLKR(wallet.totalEarned)}</span>
            <span>Withdrawn: {formatLKR(wallet.totalWithdrawn)}</span>
          </div>
          <button onClick={withdraw} disabled={!wallet.balance} className="btn-primary mt-4">Withdraw</button>
        </div>

        <h2 className="mt-8 text-lg font-bold text-navy">Transactions</h2>
        <div className="card mt-3 divide-y divide-border">
          {txns.length ? txns.map((t) => (
            <div key={t._id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <div className="font-semibold text-navy">{t.description || t.type}</div>
                <div className="text-xs text-muted">{formatDate(t.createdAt)}</div>
              </div>
              <div className={`mono font-bold ${t.amountLKR >= 0 ? "text-success" : "text-danger"}`}>
                {t.amountLKR >= 0 ? "+" : ""}{formatLKR(t.amountLKR)}
              </div>
            </div>
          )) : <p className="text-muted">No transactions yet.</p>}
        </div>
      </main>
    </>
  );
}

