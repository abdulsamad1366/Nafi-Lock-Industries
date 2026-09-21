"use client";

import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { getThemeForRoute } from "@/lib/themeTokens";

/**
 * ============================================================================
 * Context: ThemeContext
 * ============================================================================
 * React Context storing the current active theme identifier ("nafi", "greek", "raksham").
 * Default fallback is "nafi" (warm brass & clean white).
 */
const ThemeContext = createContext<string>("nafi");

/**
 * ============================================================================
 * Component: ThemeProvider
 * ============================================================================
 * Client component that synchronizes the CSS variable theme set with the
 * active Next.js route path.
 *
 * How Multi-Brand Dynamic Theming Works:
 * 1. Reads current pathname with `usePathname()`.
 * 2. Matches against `getThemeForRoute(pathname)` defined in `themeTokens.ts`.
 * 3. Injects the `data-theme` attribute on the wrapper div.
 * 4. CSS selectors in `globals.css` (e.g. `[data-theme="greek"]`) dynamically
 *    switch the CSS custom properties without re-rendering individual components.
 * 5. Adding a 4th brand in the future requires adding only 1 entry to `themeTokens.ts`.
 */
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const theme = getThemeForRoute(pathname);

  return (
    <ThemeContext.Provider value={theme}>
      {/*
        If theme is "nafi" (default), no data-theme is needed as :root rules apply.
        Otherwise injects data-theme="greek" or data-theme="raksham".
      */}
      <div data-theme={theme === "nafi" ? undefined : theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

/**
 * ============================================================================
 * Hook: useTheme
 * ============================================================================
 * Custom hook allowing any child component to consume the active theme name.
 */
export function useTheme() {
  return useContext(ThemeContext);
}
