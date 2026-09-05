"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-paper-50 py-12 text-graphite-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-mono text-xs text-brass-600 uppercase tracking-widest block mb-2 font-semibold">
            DIRECT FACTORY COMMUNICATION
          </span>
          <h1 className="font-space font-bold text-3xl sm:text-4xl text-graphite-900 mb-3">
            Contact NAFI Lock Industries
          </h1>
          <p className="font-inter text-steel-500 text-sm leading-relaxed">
            Reach out to our technical sales desk for bulk quotes, custom keying systems, or dealer inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column — Contact Info */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-graphite-900 text-white p-6 hairline-border space-y-4">
              <h3 className="font-space font-bold text-lg text-white pb-2 border-b border-graphite-700">
                Factory Headquarters
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brass-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Main Manufacturing Unit</div>
                    <div className="text-steel-400 mt-0.5">
                      Plot 42, Industrial Hardware Zone, Aligarh / Mumbai, India
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brass-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Sales & Support</div>
                    <div className="text-steel-400">+91 98765 43210</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-brass-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Email Inquiries</div>
                    <div className="text-steel-400">orders@nafilocks.com</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Action */}
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded text-xs space-y-2">
              <h4 className="font-space font-bold text-sm text-emerald-900 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600" /> Instant WhatsApp Desk
              </h4>
              <p className="text-emerald-800 leading-relaxed">
                Connect directly with an engineer for immediate stock availability and drawing approvals.
              </p>
              <a
                href="https://wa.me/919876543210?text=Hello%20NAFI%20Lock%20Industries,%20I%20have%20a%20technical%20hardware%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-space font-semibold text-emerald-800 hover:text-emerald-950 underline pt-1"
              >
                Chat on WhatsApp →
              </a>
            </div>
          </div>

          {/* Right Column — Contact Form */}
          <div className="md:col-span-7">
            {submitted ? (
              <div className="bg-white hairline-border p-8 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-space font-bold text-xl text-graphite-900">Message Received</h3>
                <p className="text-xs text-steel-500">
                  Thank you. A technical sales representative will respond to your query within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white hairline-border p-6 sm:p-8 space-y-4 text-xs">
                <h3 className="font-space font-bold text-lg text-graphite-900 pb-2 border-b border-steel-100">
                  Send Technical Inquiry
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono font-semibold text-steel-500 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Rahul Sharma"
                      className="w-full p-2.5 border border-steel-300 rounded focus:border-brass-600 outline-none font-inter"
                    />
                  </div>

                  <div>
                    <label className="font-mono font-semibold text-steel-500 block mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className="w-full p-2.5 border border-steel-300 rounded focus:border-brass-600 outline-none font-inter"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono font-semibold text-steel-500 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full p-2.5 border border-steel-300 rounded focus:border-brass-600 outline-none font-inter"
                  />
                </div>

                <div>
                  <label className="font-mono font-semibold text-steel-500 block mb-1">Message / Requirements</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Specify SKU numbers, quantities, or keying system specifications..."
                    className="w-full p-2.5 border border-steel-300 rounded focus:border-brass-600 outline-none font-inter"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-graphite-900 hover:bg-graphite-800 text-white font-space font-semibold py-3 px-4 rounded-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4 text-brass-500" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
