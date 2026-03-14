import type { Metadata } from "next";
import type { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";

import { geistMono, geistSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://wealthflow.local"),
  title: {
    default: "WealthFlow",
    template: "%s | WealthFlow",
  },
  description:
    "WealthFlow is a CRM and business intelligence platform for wealth management advisors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} font-sans`}
    >
      <body className="min-h-screen font-sans antialiased">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
