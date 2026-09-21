"use client";

import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { getThemeForRoute } from "@/lib/themeTokens";

const ThemeContext = createContext<string>("nafi");

/**
 * ThemeProvider — applies the correct CSS variable set based on the active
 * brand route. Per architecture doc: "Adding a 4th brand later means adding
 * one entry to themeTokens.ts, not touching every component."
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const theme = getThemeForRoute(pathname);

  return (
    <ThemeContext.Provider value={theme}>
      <div data-theme={theme === "nafi" ? undefined : theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
