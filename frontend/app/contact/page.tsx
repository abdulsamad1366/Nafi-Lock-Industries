import ContactForm from "@/components/ContactForm";

/**
 * Contact page — company background + inquiry form.
 * Per 05-SITE-MAP-AND-PAGES.md:
 * - Company background (manufacturing capability, factory, dealer network)
 * - Inquiry form
 * - Contact details (email/phone) — TBD
 */
export default function ContactPage() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-headline text-4xl mb-6">Contact Us</h1>

        {/* Company background — content TBD */}
        <section className="mb-16">
          <p className="text-muted max-w-prose mb-4">
            Nafi Lock Industries is a leading lock manufacturer with decades of
            heritage in precision engineering. Our three brands — S-Nafi, Greek,
            and Raksham — serve dealers, distributors, and customers across India.
          </p>
          <p className="text-muted max-w-prose">
            Contact details (email/phone) to be provided.
          </p>
        </section>

        {/* Inquiry form */}
        <section>
          <h2 className="font-headline text-2xl mb-6">Send an Inquiry</h2>
          <ContactForm />
        </section>
      </div>
    </div>
  );
}
