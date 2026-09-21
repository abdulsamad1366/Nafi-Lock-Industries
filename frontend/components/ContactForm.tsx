/**
 * Contact/inquiry form component.
 * Fields per data model: name, company (optional), email, phone, message.
 * brandId and productId can be pre-filled via URL params.
 */
export default function ContactForm() {
  return (
    <form className="space-y-5 max-w-lg">
      <div>
        <label className="block text-sm text-muted mb-1">Name *</label>
        <input
          type="text"
          name="name"
          required
          className="w-full bg-background border border-divider rounded px-3 py-2 text-primary"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-1">Company</label>
        <input
          type="text"
          name="company"
          className="w-full bg-background border border-divider rounded px-3 py-2 text-primary"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-1">Email *</label>
        <input
          type="email"
          name="email"
          required
          className="w-full bg-background border border-divider rounded px-3 py-2 text-primary"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-1">Phone *</label>
        <input
          type="tel"
          name="phone"
          required
          className="w-full bg-background border border-divider rounded px-3 py-2 text-primary"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-1">Message *</label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full bg-background border border-divider rounded px-3 py-2 text-primary resize-y"
        />
      </div>

      <button
        type="submit"
        className="px-8 py-3 bg-accent text-background font-medium rounded hover:bg-accent-hover transition-colors"
      >
        Submit Inquiry
      </button>
    </form>
  );
}
