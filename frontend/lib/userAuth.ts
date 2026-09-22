"use client";

/**
 * ============================================================================
 * Session & Authentication Helpers for Customers and Distributors
 * ============================================================================
 * Deliberately isolated from Admin authentication.
 * Stores token in localStorage and cookies for client/server hydration.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "CUSTOMER" | "DISTRIBUTOR";
}

export type DistributorStatus = "PENDING" | "APPROVED" | "REJECTED";

const TOKEN_KEY = "nafi_user_token";
const USER_KEY = "nafi_user_profile";
const STATUS_KEY = "nafi_distributor_status";

/**
 * Retrieve current user JWT token
 */
export function getUserToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Persist user JWT token to localStorage and cookie
 */
export function setUserToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=604800; SameSite=Lax`;
}

/**
 * Remove token
 */
export function removeUserToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Get cached user profile
 */
export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

/**
 * Persist user profile
 */
export function setUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Remove user profile
 */
export function removeUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
}

/**
 * Get distributor approval status
 */
export function getDistributorStatus(): DistributorStatus | null {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(STATUS_KEY) as DistributorStatus) || null;
}

/**
 * Set distributor approval status
 */
export function setDistributorStatus(status: DistributorStatus | null): void {
  if (typeof window === "undefined") return;
  if (status) {
    localStorage.setItem(STATUS_KEY, status);
  } else {
    localStorage.removeItem(STATUS_KEY);
  }
}

/**
 * Clear full user session
 */
export function clearUserSession(): void {
  removeUserToken();
  removeUser();
  if (typeof window !== "undefined") {
    localStorage.removeItem(STATUS_KEY);
    localStorage.removeItem("nafi_distributor_cart");
  }
}

/**
 * Generate Authorization headers for API calls
 */
export function getUserAuthHeaders(): Record<string, string> {
  const token = getUserToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Check if user is logged in
 */
export function isUserLoggedIn(): boolean {
  return !!getUserToken();
}

/**
 * Check if user has DISTRIBUTOR role
 */
export function isDistributor(): boolean {
  const user = getUser();
  return user?.role === "DISTRIBUTOR";
}

/**
 * Check if user is an approved distributor
 */
export function isApprovedDistributor(): boolean {
  const user = getUser();
  const status = getDistributorStatus();
  return user?.role === "DISTRIBUTOR" && status === "APPROVED";
}
