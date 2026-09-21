const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Frontend API client for the backend REST API.
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// ── Brands ──
export async function getBrands() {
  return fetchAPI<Brand[]>("/brands");
}

export async function getBrandBySlug(slug: string) {
  return fetchAPI<BrandWithProducts>(`/brands/${slug}`);
}

// ── Products ──
export async function getProducts(params?: { brand?: string; category?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.brand) searchParams.set("brand", params.brand);
  if (params?.category) searchParams.set("category", params.category);
  const qs = searchParams.toString();
  return fetchAPI<Product[]>(`/products${qs ? `?${qs}` : ""}`);
}

export async function getProductBySlug(slug: string) {
  return fetchAPI<Product>(`/products/${slug}`);
}

// ── Categories ──
export async function getCategories() {
  return fetchAPI<Category[]>("/categories");
}

// ── Inquiries ──
export async function submitInquiry(data: InquiryInput) {
  return fetchAPI<Inquiry>("/inquiries", {
    method: "POST",
    body: JSON.stringify(data),
  });
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
