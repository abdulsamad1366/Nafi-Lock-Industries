"use client";

/**
 * ============================================================================
 * Session & Authentication Helpers for Admin / Factory Management
 * ============================================================================
 * Strictly isolated from customer & distributor public auth.
 */

export interface AdminUserSession {
  id: string;
  email: string;
  role: string;
}

const ADMIN_TOKEN_KEY = "nafi_admin_token";
const ADMIN_USER_KEY = "nafi_admin_profile";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  document.cookie = `${ADMIN_TOKEN_KEY}=${token}; path=/; max-age=86400; SameSite=Lax`;
}

export function removeAdminToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
  document.cookie = `${ADMIN_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

export function getAdminUser(): AdminUserSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ADMIN_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUserSession;
  } catch {
    return null;
  }
}

export function setAdminUser(user: AdminUserSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}
