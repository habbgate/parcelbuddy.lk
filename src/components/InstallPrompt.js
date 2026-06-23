"use client";

import { useEffect, useState } from "react";

// Add-to-home-screen prompt. Appears once the browser fires
// `beforeinstallprompt`; dismissible and remembered via localStorage.
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("pb_install_dismissed")) return;
    const onPrompt = (e) => {
      e.preventDefault();
      setDeferred(e);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  async function install() {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    setVisible(false);
    setDeferred(null);
  }

  function dismiss() {
    localStorage.setItem("pb_install_dismissed", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-sm animate-fade-up">
      <div className="card-glass flex items-center gap-3 !p-4 shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="ParcelBuddy" className="h-11 w-auto max-w-[44px] object-contain rounded-xl" />
        <div className="flex-1">
          <div className="text-sm font-bold text-navy">Install ParcelBuddy</div>
          <div className="text-xs text-muted">Add to your home screen for quick access.</div>
        </div>
        <button onClick={dismiss} className="text-sm font-semibold text-muted">Later</button>
        <button onClick={install} className="btn-primary !px-4 !py-2 text-sm">Install</button>
      </div>
    </div>
  );
}

