"use client";

import { SessionProvider } from "next-auth/react";
import ServiceWorker from "@/components/ServiceWorker";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      {children}
      <ServiceWorker />
    </SessionProvider>
  );
}
