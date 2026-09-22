"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser } from "@/lib/userAuth";

interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
}

export default function AccountInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Inquiries can be fetched or populated from user state
    setIsLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-divider">
        <div>
          <h2 className="font-serif text-xl font-bold text-primary">
            Inquiry & Quotation History
          </h2>
          <p className="text-xs text-muted">
            Track communication and specifications submitted to the Nafi manufacturing foundry
          </p>
        </div>
        <Link
          href="/contact"
          className="px-4 py-2 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs"
        >
          New Inquiry +
        </Link>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-surface border border-divider rounded-2xl p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-accent/10 text-accent mx-auto flex items-center justify-center mb-4">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3 className="font-serif font-bold text-base text-primary mb-1">
            No Inquiries Submitted Yet
          </h3>
          <p className="text-xs text-muted max-w-sm mx-auto mb-6">
            Have questions about custom metallurgy, key suites, or architectural bulk orders? Submit an inquiry directly to our factory desk.
          </p>
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors"
          >
            Submit Engineering Inquiry
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-surface border border-divider rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                      inq.status === "closed"
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-500"
                        : inq.status === "contacted"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-blue-500/10 text-blue-600"
                    }`}
                  >
                    {inq.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-muted font-mono">
                    {new Date(inq.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-xs text-primary font-medium">{inq.message}</p>
              </div>

              <div className="text-right">
                <Link
                  href="/contact"
                  className="text-xs text-accent font-semibold hover:underline"
                >
                  Send Follow-up Message →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
