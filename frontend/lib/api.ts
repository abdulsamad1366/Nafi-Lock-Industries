import { getUserAuthHeaders } from "./userAuth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

/**
 * Frontend API client with automatic token injection
 */
export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit,
  authType: "user" | "admin" | "none" = "user"
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authType === "user") {
    Object.assign(headers, getUserAuthHeaders());
  } else if (authType === "admin") {
    if (typeof window !== "undefined") {
      const adminToken = localStorage.getItem("nafi_admin_token");
      if (adminToken) {
        headers["Authorization"] = `Bearer ${adminToken}`;
      }
    }
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options?.headers as Record<string, string>),
    },
  });

  if (!res.ok) {
    let errorDetail = `API error: ${res.status} ${res.statusText}`;
    try {
      const errorJson = await res.json();
      if (errorJson.error) errorDetail = errorJson.error;
    } catch {
      // fallback
    }
    throw new Error(errorDetail);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}

// ── Brands ──
export async function getBrands() {
  return fetchAPI<Brand[]>("/brands", undefined, "none");
}

export async function getBrandBySlug(slug: string) {
  return fetchAPI<BrandWithProducts>(`/brands/${slug}`, undefined, "none");
}

// ── Products ──
export async function getProducts(params?: { brand?: string; category?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.brand) searchParams.set("brand", params.brand);
  if (params?.category) searchParams.set("category", params.category);
  const qs = searchParams.toString();
  return fetchAPI<Product[]>(`/products${qs ? `?${qs}` : ""}`, undefined, "user");
}

export async function getProductBySlug(slug: string) {
  return fetchAPI<Product>(`/products/${slug}`, undefined, "user");
}

// ── Categories ──
export async function getCategories() {
  return fetchAPI<Category[]>("/categories", undefined, "none");
}

// ── Inquiries ──
export async function submitInquiry(data: InquiryInput) {
  return fetchAPI<Inquiry>("/inquiries", {
    method: "POST",
    body: JSON.stringify(data),
  }, "user");
}

// ── Phase 2: Public User & Distributor Auth ──
export async function signupUser(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "CUSTOMER" | "DISTRIBUTOR";
  companyName?: string;
  gstNumber?: string;
  businessAddress?: string;
  city?: string;
  state?: string;
}) {
  return fetchAPI<{
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string | null;
      role: "CUSTOMER" | "DISTRIBUTOR";
    };
    status: "PENDING" | "APPROVED" | "REJECTED" | null;
  }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  }, "none");
}

export async function loginUser(data: { email: string; password: string }) {
  return fetchAPI<{
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string | null;
      role: "CUSTOMER" | "DISTRIBUTOR";
    };
    status: "PENDING" | "APPROVED" | "REJECTED" | null;
  }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  }, "none");
}

export async function loginAdmin(data: { email: string; password: string }) {
  return fetchAPI<{
    token: string;
    admin: {
      id: string;
      email: string;
      role: string;
    };
  }>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  }, "none");
}

// ── Distributor Endpoints ──
export async function getDistributorProfile() {
  return fetchAPI<DistributorMeResponse>("/distributor/me", undefined, "user");
}

export async function applyForDistributor(data: {
  companyName: string;
  gstNumber?: string;
  businessAddress: string;
  city: string;
  state: string;
}) {
  return fetchAPI<{ message: string; role: string; profile: any }>("/distributor/apply", {
    method: "POST",
    body: JSON.stringify(data),
  }, "user");
}

// ── B2B Orders ──
export async function createOrder(data: {
  items: Array<{ productId: string; quantity: number }>;
  notes?: string;
}) {
  return fetchAPI<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  }, "user");
}

export async function getDistributorOrders() {
  return fetchAPI<Order[]>("/orders", undefined, "user");
}

export async function getDistributorOrderById(id: string) {
  return fetchAPI<Order>(`/orders/${id}`, undefined, "user");
}

// ── Financial Ledgers ──
export async function requestLedger(note?: string) {
  return fetchAPI<LedgerRequest>("/ledger-requests", {
    method: "POST",
    body: JSON.stringify({ note }),
  }, "user");
}

export async function getDistributorLedgerRequests() {
  return fetchAPI<LedgerRequest[]>("/ledger-requests", undefined, "user");
}

export async function getDistributorLedgers() {
  return fetchAPI<Ledger[]>("/ledgers", undefined, "user");
}

export function getLedgerDownloadUrl(ledgerId: string): string {
  return `${API_BASE}/ledgers/${ledgerId}/download`;
}

// ── Catalogs ──
export async function getCatalogs() {
  return fetchAPI<Catalog[]>("/catalogs", undefined, "none");
}

export function getCatalogDownloadUrl(catalogId: string): string {
  return `${API_BASE}/catalogs/${catalogId}/download`;
}

// ── Liked Products ──
export async function likeProduct(productId: string) {
  return fetchAPI<{ message: string }>(`/products/${productId}/like`, {
    method: "POST",
  }, "user");
}

export async function unlikeProduct(productId: string) {
  return fetchAPI<{ message: string }>(`/products/${productId}/like`, {
    method: "DELETE",
  }, "user");
}

export async function getLikedProducts() {
  return fetchAPI<Product[]>("/users/me/liked-products", undefined, "user");
}

// ── Types ──
export interface Brand {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl: string | null;
  heroImageUrl: string | null;
  themeKey: string;
  order: number;
  isActive: boolean;
}

export interface BrandWithProducts extends Brand {
  products: Product[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brandId: string;
  brand?: Brand;
  categoryId: string;
  category?: Category;
  description: string;
  material: string;
  size: string;
  finish: string;
  numberOfKeys: number;
  lockingMechanism: string;
  warranty: string;
  images: string[];
  dealerPrice?: number | null;
  minOrderQty?: number | null;
  isActive: boolean;
}

export interface InquiryInput {
  name: string;
  company?: string;
  email: string;
  phone: string;
  message: string;
  brandId?: string;
  productId?: string;
}

export interface Inquiry extends InquiryInput {
  id: string;
  status: string;
  createdAt: string;
}

export interface SalesRep {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string | null;
}

export interface DistributorProfileData {
  id: string;
  userId: string;
  companyName: string;
  gstNumber?: string | null;
  businessAddress: string;
  city: string;
  state: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  appliedAt: string;
  reviewedAt?: string | null;
  assignedRep?: SalesRep | null;
}

export interface DistributorMeResponse {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "CUSTOMER" | "DISTRIBUTOR";
  createdAt: string;
  distributorProfile?: DistributorProfileData | null;
}

export interface OrderItem {
  id: string;
  productId: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    material?: string;
    size?: string;
  };
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  distributorId: string;
  status: "PLACED" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  notes?: string | null;
  placedAt: string;
  items: OrderItem[];
}

export interface LedgerRequest {
  id: string;
  distributorId: string;
  note?: string | null;
  status: "REQUESTED" | "FULFILLED";
  requestedAt: string;
  fulfilledAt?: string | null;
}

export interface Ledger {
  id: string;
  distributorId: string;
  requestId?: string | null;
  title: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface Catalog {
  id: string;
  title: string;
  fileUrl: string;
  brandId?: string | null;
  brand?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  uploadedAt: string;
}
