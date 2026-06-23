"use client";

import { SessionProvider } from "next-auth/react";
import ServiceWorker from "@/components/ServiceWorker";
import InstallPrompt from "@/components/InstallPrompt";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      {children}
      <ServiceWorker />
      <InstallPrompt />
    </SessionProvider>
  );
}
