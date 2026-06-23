import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "ParcelBuddy — Travel. Deliver. Earn.",
  description:
    "Community parcel delivery platform connecting senders with verified travelers across Sri Lanka. Turn your journey into income.",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  appleWebApp: { capable: true, title: "ParcelBuddy", statusBarStyle: "default" },
};

export const viewport = {
  themeColor: "#1A2B4A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

