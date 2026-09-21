/**
 * Theme tokens — maps brand slugs/routes to theme keys.
 *
 * Per architecture doc: "Brand theme colors live as DATA in themeTokens.ts,
 * not hardcoded into components. Adding a 4th brand later means adding one
 * entry to this data file, not touching every component."
 */

export interface ThemeEntry {
  themeKey: string;
  routePrefix: string;
}

export const BRAND_THEMES: ThemeEntry[] = [
  { themeKey: "nafi", routePrefix: "/brands/s-nafi" },
  { themeKey: "greek", routePrefix: "/brands/greek" },
  { themeKey: "raksham", routePrefix: "/brands/raksham" },
];

/**
 * Given the current pathname, returns the theme key to apply.
 * Falls back to "nafi" (default/Home palette).
 */
export function getThemeForRoute(pathname: string): string {
  const match = BRAND_THEMES.find((t) => pathname.startsWith(t.routePrefix));
  return match?.themeKey ?? "nafi";
}
