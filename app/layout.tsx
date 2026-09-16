import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://besetech.ca"),
  title: "BeSe Tech — Trusted Manufacturing Execution",
  description: "Supplier qualification, AI-assisted sourcing and coordinated project execution for advanced manufacturing.",
  alternates: {
    canonical: "/",
  },
  icons: { icon: "/logo.png", shortcut: "/logo.png", apple: "/logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="dark"><body>{children}</body></html>;
}
