import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import Header from "@/components/Header";
import Marquee from "@/components/Marquee";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

/**
 * ============================================================================
 * Typography Configurations (Next.js Font Optimization)
 * ============================================================================
 * Fonts are automatically pre-downloaded, self-hosted, and optimized
 * with zero layout shift (CLS).
 */

// 1. Fraunces: High-contrast serif used for brand headlines & section titles
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["600", "700"],
  display: "swap",
});

// 2. IBM Plex Sans: Clean, highly legible sans-serif for general body copy
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

// 3. IBM Plex Mono: Monospace for technical lock specifications, dimensions & badges
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  display: "swap",
});

/**
 * ============================================================================
 * Global SEO Metadata
 * ============================================================================
 */
export const metadata: Metadata = {
  title: "Nafi Lock Industries — Premium Lock Manufacturer",
  description:
    "S-Nafi · Greek · Raksham — three brands, one legacy of precision-engineered locks. Browse padlocks, mortise locks, and more.",
};

/**
 * ============================================================================
 * Root Layout Component
 * ============================================================================
 * Wraps every route in the Next.js App Router application.
 *
 * Layout Structure:
 * 1. <html>: Injects CSS variable classes for all three font families.
 * 2. <body>: Sets base background, text color, and anti-aliased font rendering.
 * 3. <ThemeProvider>: Injects dynamic data-theme attributes based on active route.
 * 4. <Marquee>: Top announcement ribbon with ISO & manufacturer credentials.
 * 5. <Header>: Main site brand navigation (Home | Brands | Contact).
 * 6. <main>: Slot for the active page route content.
 * 7. <Footer>: Global site footer with links and company info.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="bg-background text-primary font-body antialiased">
        {/* Client-side Theme Provider handles multi-brand palette switching */}
        <ThemeProvider>
          {/* Top Marquee Ribbon: Stays dark with gold accents above the header */}
          <Marquee />

          {/* Primary Navigation Header */}
          <Header />

          {/* Active Page Route Body */}
          <main>{children}</main>

          {/* Site-wide Footer */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
