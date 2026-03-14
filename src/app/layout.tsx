import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/theme/theme-provider";
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} font-sans`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen font-sans antialiased"
      >
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
