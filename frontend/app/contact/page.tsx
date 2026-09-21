import ContactForm from "@/components/ContactForm";

/**
 * ============================================================================
 * Page Component: ContactPage
 * ============================================================================
 * Central hub for customer inquiries, dealer onboarding, and wholesale requests.
 *
 * Page Architecture (05-SITE-MAP-AND-PAGES.md):
 * 1. Introduction & Heritage: Company background, manufacturing infrastructure,
 *    and Pan-India distributor presence across S-Nafi, Greek, and Raksham.
 * 2. Inquiry Form Section: Interactive form (<ContactForm />) capturing
 *    prospective client details, contact channels, and customized requests.
 */
export default function ContactPage() {
  return (
    <div className="py-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* ── Page Title ── */}
        <h1 className="font-headline text-4xl mb-6">Contact Us</h1>

        {/* ── Company Background & Industrial Credentials ── */}
        <section className="mb-16">
          <p className="text-muted max-w-prose mb-4 leading-relaxed">
            Nafi Lock Industries is a leading lock manufacturer with decades of
            heritage in precision engineering. Our three brands — S-Nafi, Greek,
            and Raksham — serve dealers, distributors, and commercial customers
            across India.
          </p>
          <p className="text-muted max-w-prose">
            For immediate factory inquiries, dealership applications, or custom OEM
            lock specifications, please submit the form below.
          </p>
        </section>

        {/* ── Interactive Inquiry Form ── */}
        <section>
          <h2 className="font-headline text-2xl mb-6">Send an Inquiry</h2>
          <ContactForm />
        </section>
      </div>
    </div>
  );
}
