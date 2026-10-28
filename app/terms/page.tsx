
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Kandid Luxury",
  description:
    "Read the terms and conditions for using the Kandid Luxury website and purchasing our products.",
  alternates: {
    canonical: "https://kandidluxury.com/terms",
  },
};

const sections = [
  {
    title: "1. About These Terms",
    content: (
      <>
        These Terms of Service govern your use of the Kandid Luxury website
        and your purchase of products offered through it. By using this
        website or placing an order, you agree to these terms. If you do not
        agree, please do not use the website.
      </>
    ),
  },
  {
    title: "2. Eligibility and Website Use",
    content: (
      <>
        You must be legally capable of entering into a binding agreement to
        place an order. You agree to provide accurate, current information and
        not misuse the website, interfere with its operation, or attempt
        unauthorized access to its systems.
      </>
    ),
  },
  {
    title: "3. Products and Product Information",
    content: (
      <>
        We aim to display accurate product descriptions, images, prices, and
        availability. Colours and appearance may vary slightly depending on
        your screen. Product availability may change without notice. Please
        read product descriptions and usage instructions before purchasing.
        Cosmetic products are not a substitute for medical advice or treatment.
        Individual results may vary.
      </>
    ),
  },
  {
    title: "4. Prices, Taxes, and Offers",
    content: (
      <>
        Prices are displayed in Indian rupees unless stated otherwise.
        Applicable charges, taxes, and delivery fees will be shown where
        relevant during checkout. Promotional offers may have specific
        conditions, validity periods, and availability limits. We reserve the
        right to correct genuine pricing or listing errors and will contact
        affected customers where appropriate before proceeding with an order.
      </>
    ),
  },
  {
    title: "5. Orders and Acceptance",
    content: (
      <>
        Placing an order constitutes an offer to purchase. An order is not
        accepted until we confirm it. We may decline or cancel an order for
        reasons including product unavailability, suspected fraud, payment
        issues, inaccurate pricing, or delivery limitations. If a payment has
        already been collected for an order we cancel, we will arrange an
        appropriate refund.
      </>
    ),
  },
  {
    title: "6. Payments",
    content: (
      <>
        Payments may be processed through the payment methods made available
        at checkout, including third-party payment providers. Payment
        processing is subject to the provider's terms and security procedures.
        Do not share your payment passwords, PINs, or one-time passwords with
        anyone claiming to represent Kandid Luxury. An order is considered
        paid only after payment confirmation is received.
      </>
    ),
  },
  {
    title: "7. Shipping and Delivery",
    content: (
      <>
        Orders are delivered to eligible addresses in the serviceable areas
        shown at checkout. Delivery estimates are indicative and may be
        affected by courier operations, weather, public holidays, or other
        circumstances beyond our reasonable control. Please provide a
        complete and accurate shipping address and reachable contact details.
        Contact customer support if your shipment is delayed, lost, or marked
        delivered but not received.
      </>
    ),
  },
  {
    title: "8. Cancellations, Returns, and Refunds",
    content: (
      <>
        Cancellation, return, replacement, and refund requests are handled
        according to the applicable policy published on our website and
        applicable law. For hygiene and safety reasons, opened or used
        cosmetics may be subject to restrictions where permitted by law.
        Damaged, defective, incorrect, or missing items should be reported
        promptly with your order details and supporting photographs where
        available. Nothing in these terms removes any consumer right that
        cannot lawfully be excluded.

        Once an order has been dispatched, customers are expected to accept 
        delivery. If a customer refuses to accept the parcel, fails to 
        receive it, or is unavailable to accept delivery despite reasonable 
        delivery attempts, the shipment may be returned to the seller.
        In such cases, refunds are not guaranteed and may be subject to the
        applicable refund policy and law. Shipping, return shipping, and other
        applicable charges may be deducted where legally permitted.This policy 
        does not limit any consumer rights or remedies that cannot legally be
        excluded under applicable law.
      </>
    ),
  },
  {
    title: "9. Cosmetic Product Safety",
    content: (
      <>
        Follow the instructions and precautions supplied with each product.
        Review the ingredient information before use, particularly if you
        have known sensitivities. Discontinue use if irritation occurs and
        seek appropriate medical advice if needed. We do not guarantee that
        every product will produce the same results for every individual.
        Product information on this website is not intended to diagnose,
        treat, cure, or prevent any disease.
      </>
    ),
  },
  {
    title: "10. Intellectual Property",
    content: (
      <>
        Unless otherwise stated, the website's branding, text, graphics,
        photographs, and other content are owned by or licensed to Kandid
        Luxury. You may not reproduce, distribute, modify, or commercially
        exploit this content without prior permission, except where permitted
        by applicable law.
      </>
    ),
  },
  {
    title: "11. Third-Party Services and Links",
    content: (
      <>
        Our website may use third-party services for payments, authentication,
        analytics, or delivery. Those services may be governed by their own
        terms and privacy policies. We are not responsible for third-party
        websites or services to the extent permitted by applicable law.
      </>
    ),
  },
  {
    title: "12. Limitation of Liability",
    content: (
      <>
        To the extent permitted by applicable law, Kandid Luxury is not liable
        for indirect or consequential losses arising from the use of this
        website. Nothing in these terms excludes or limits liability that
        cannot lawfully be excluded or limited, including applicable consumer
        rights.
      </>
    ),
  },
  {
    title: "13. Privacy",
    content: (
      <>
        Our collection and use of personal information are described in our{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:opacity-70"
        >
          Privacy Policy
        </Link>
        . By using the website, you acknowledge that you have had an
        opportunity to review it.
      </>
    ),
  },
  {
    title: "14. Changes to These Terms",
    content: (
      <>
        We may update these terms from time to time. The revised version will
        be published on this page with an updated effective date. Changes will
        apply as permitted by applicable law.
      </>
    ),
  },
  {
    title: "15. Governing Law and Disputes",
    content: (
      <>
        These terms are subject to applicable laws of India. Disputes will be
        handled by competent forums in accordance with applicable law and
        consumer protection rights.
      </>
    ),
  },
  {
    title: "16. Contact Us",
    content: (
      <>
        For questions about these terms, orders, or products, please use the
        customer support contact details published on the Kandid Luxury
        website.
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F8F8F6] text-[#292824]">
      <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
        <Link
          href="/"
          className="text-sm text-[#716E65] underline underline-offset-4 hover:opacity-70"
        >
          ← Back to Kandid Luxury
        </Link>

        <header className="mt-10 border-b border-[#DEDCD5] pb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#827D70]">
            KANDID LUXURY
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-[#716E65]">
            Effective date: October 28, 2026
          </p>
          <p className="mt-6 max-w-2xl leading-7 text-[#59574F]">
            These terms explain the conditions for using our website and
            purchasing products from Kandid Luxury. Please read them carefully
            before placing an order.
          </p>
        </header>

        <div className="divide-y divide-[#DEDCD5]">
          {sections.map((section) => (
            <section key={section.title} className="py-7">
              <h2 className="font-serif text-xl sm:text-2xl">
                {section.title}
              </h2>
              <div className="mt-3 leading-7 text-[#59574F]">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-8 border-t border-[#DEDCD5] pt-6 text-sm text-[#716E65]">
          © {new Date().getFullYear()} Kandid Luxury. All rights reserved.
          <div className="mt-3 flex gap-5">
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:opacity-70"
            >
              Privacy Policy
            </Link>
            <Link
              href="/"
              className="underline underline-offset-4 hover:opacity-70"
            >
              Home
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
