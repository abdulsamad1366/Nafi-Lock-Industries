/**
 * ============================================================================
 * Component: ContactForm
 * ============================================================================
 * Inquiry submission form for prospective buyers, dealers, and OEM partners.
 *
 * Data Model Fields:
 * - name (required): Full name of the inquirer
 * - company (optional): Business or dealership name
 * - email (required): Contact email address
 * - phone (required): Phone / WhatsApp number
 * - message (required): Product specifications or inquiry details
 *
 * Form Styling:
 * - Uses clean background (bg-background) and border (border-divider)
 *   so inputs look crisp and elevated on both white and light-surface backdrops.
 * - Submit button uses brand accent (bg-accent) with high-contrast text-white.
 */
export default function ContactForm() {
  return (
    <form className="space-y-5 max-w-lg">
      {/* ── Input Field: Name (Required) ── */}
      <div>
        <label className="block text-sm text-muted mb-1 font-medium">
          Name <span className="text-accent">*</span>
        </label>
        <input
          type="text"
          name="name"
          required
          placeholder="e.g. Rajesh Kumar"
          className="w-full bg-background border border-divider rounded px-3 py-2 text-primary focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* ── Input Field: Company (Optional) ── */}
      <div>
        <label className="block text-sm text-muted mb-1 font-medium">
          Company / Dealership (Optional)
        </label>
        <input
          type="text"
          name="company"
          placeholder="e.g. Hardware Distributors Ltd."
          className="w-full bg-background border border-divider rounded px-3 py-2 text-primary focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* ── Input Field: Email (Required) ── */}
      <div>
        <label className="block text-sm text-muted mb-1 font-medium">
          Email Address <span className="text-accent">*</span>
        </label>
        <input
          type="email"
          name="email"
          required
          placeholder="e.g. rajesh@example.com"
          className="w-full bg-background border border-divider rounded px-3 py-2 text-primary focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* ── Input Field: Phone (Required) ── */}
      <div>
        <label className="block text-sm text-muted mb-1 font-medium">
          Phone Number <span className="text-accent">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          required
          placeholder="e.g. +91 98765 43210"
          className="w-full bg-background border border-divider rounded px-3 py-2 text-primary focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* ── Input Field: Message (Required) ── */}
      <div>
        <label className="block text-sm text-muted mb-1 font-medium">
          Inquiry Details <span className="text-accent">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Specify products of interest, estimated bulk quantities, or dealership inquiries..."
          className="w-full bg-background border border-divider rounded px-3 py-2 text-primary resize-y focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* ── Action: Form Submission Button ── */}
      <button
        type="submit"
        className="px-8 py-3 bg-accent text-white font-medium rounded hover:bg-accent-hover transition-colors shadow-sm"
      >
        Submit Inquiry
      </button>
    </form>
  );
}
