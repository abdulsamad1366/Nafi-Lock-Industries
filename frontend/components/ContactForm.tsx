"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { submitInquiry } from "@/lib/api";

function ContactFormInner() {
  const searchParams = useSearchParams();

  const [productId, setProductId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [brandSlug, setBrandSlug] = useState("");

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pId = searchParams.get("productId") || searchParams.get("product") || "";
    const bId = searchParams.get("brandId") || "";
    const bSlug = searchParams.get("brand") || "";

    if (pId) setProductId(pId);
    if (bId) setBrandId(bId);
    if (bSlug) setBrandSlug(bSlug);

    // If pre-filled from product page, set introductory message placeholder
    if (pId && !message) {
      setMessage(`Hello, I am interested in inquiring about product ID: ${pId}. Please provide pricing, technical datasheets, and delivery schedules.`);
    } else if (bSlug && !message) {
      setMessage(`Hello, I am interested in dealership and wholesale stockist opportunities for ${bSlug.toUpperCase()} locks.`);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await submitInquiry({
        name,
        company: company.trim() || undefined,
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        productId: productId || undefined,
        brandId: brandId || undefined,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit inquiry. Please try again or contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-8 rounded-2xl bg-[#FAF9F5] border border-divider text-center max-w-lg shadow-sm">
        <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-serif text-xl font-bold text-primary mb-2">Inquiry Dispatched</h3>
        <p className="text-xs text-muted leading-relaxed mb-6">
          Thank you for reaching out to Nafi Lock Industries. Our wholesale and commercial team has received your specifications and will respond within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsSuccess(false);
            setMessage("");
          }}
          className="px-6 py-2.5 bg-accent text-white font-serif font-bold text-xs rounded-xl hover:bg-accent-hover transition-colors cursor-pointer"
        >
          Send Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      {/* Context Banner if Pre-filled */}
      {(productId || brandSlug) && (
        <div className="p-3.5 rounded-xl bg-accent/10 border border-accent/20 text-xs text-accent font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>
              Pre-filled inquiry for:{" "}
              <strong>{productId ? `Product (${productId})` : `Brand (${brandSlug})`}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setProductId("");
              setBrandId("");
              setBrandSlug("");
            }}
            className="text-[11px] underline opacity-80 hover:opacity-100 cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* Hidden reference IDs */}
      {productId && <input type="hidden" name="productId" value={productId} />}
      {brandId && <input type="hidden" name="brandId" value={brandId} />}

      {/* ── Input Field: Name (Required) ── */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1 font-bold">
          Full Name <span className="text-accent">*</span>
        </label>
        <input
          type="text"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Rajesh Kumar"
          className="w-full bg-background border border-divider rounded-xl px-3.5 py-2.5 text-sm text-primary focus:outline-hidden focus:border-accent transition-colors"
        />
      </div>

      {/* ── Input Field: Company (Optional) ── */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1 font-bold">
          Company / Dealership (Optional)
        </label>
        <input
          type="text"
          name="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="e.g. Hardware Distributors Ltd."
          className="w-full bg-background border border-divider rounded-xl px-3.5 py-2.5 text-sm text-primary focus:outline-hidden focus:border-accent transition-colors"
        />
      </div>

      {/* ── Input Field: Email (Required) ── */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1 font-bold">
          Email Address <span className="text-accent">*</span>
        </label>
        <input
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. rajesh@example.com"
          className="w-full bg-background border border-divider rounded-xl px-3.5 py-2.5 text-sm text-primary focus:outline-hidden focus:border-accent transition-colors"
        />
      </div>

      {/* ── Input Field: Phone (Required) ── */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1 font-bold">
          Phone Number <span className="text-accent">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. +91 98765 43210"
          className="w-full bg-background border border-divider rounded-xl px-3.5 py-2.5 text-sm text-primary focus:outline-hidden focus:border-accent transition-colors font-mono"
        />
      </div>

      {/* ── Input Field: Message (Required) ── */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1 font-bold">
          Inquiry Details <span className="text-accent">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Specify products of interest, estimated bulk quantities, or dealership inquiries..."
          className="w-full bg-background border border-divider rounded-xl px-3.5 py-2.5 text-sm text-primary resize-y focus:outline-hidden focus:border-accent transition-colors"
        />
      </div>

      {/* ── Action: Form Submission Button ── */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto px-8 py-3 bg-accent text-white font-serif font-bold text-sm rounded-xl hover:bg-accent-hover transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? "Submitting Inquiry..." : "Submit Inquiry"}
      </button>
    </form>
  );
}

export default function ContactForm() {
  return (
    <Suspense fallback={<div className="p-4 text-xs font-mono text-muted">Loading inquiry form...</div>}>
      <ContactFormInner />
    </Suspense>
  );
}
