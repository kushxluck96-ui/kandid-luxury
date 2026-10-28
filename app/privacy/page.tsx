
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Kandid Luxury",
  description:
    "Learn how Kandid Luxury collects, uses, and protects your personal information.",
  alternates: {
    canonical: "https://kandidluxury.com/privacy",
  },
};

const sections = [
  {
    title: "1. Information We Collect",
    content: (
      <>
        <p>
          We may collect information you provide when you create an account,
          place an order, contact us, or use our website, including your name,
          email address, phone number, shipping address, and order details.
        </p>
        <p>
          If you sign in using Google, we may receive basic profile information
          permitted by your Google account settings and the permissions you
          approve, such as your name, email address, and profile picture.
        </p>
        <p>
          Our website may also process technical information such as browser
          type, device information, IP address, and website usage data.
        </p>
      </>
    ),
  },
  {
    title: "2. How We Use Your Information",
    content: (
      <p>
        We use personal information to operate our website, create and manage
        customer accounts, process orders and payments, arrange shipping,
        provide customer support, prevent fraud, maintain website security,
        improve our services, and meet applicable legal obligations. We will
        use information for marketing only where permitted by applicable law
        and your preferences.
      </p>
    ),
  },
  {
    title: "3. Google Sign-In",
    content: (
      <p>
        You may be able to sign in using Google. Google handles its own
        authentication process. We use the information made available through
        Google sign-in to authenticate you and manage your account. Our use
        and transfer of information received from Google APIs complies with
        the Google API Services User Data Policy, including its Limited Use
        requirements where applicable. You can review Google’s privacy policy
        at{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Privacy Policy
        </a>
        .
      </p>
    ),
  },
  {
    title: "4. Payments and Orders",
    content: (
      <p>
        Payments may be processed by third-party payment providers, including
        Razorpay. Payment providers handle payment information under their
        own terms and privacy policies. We may receive transaction references,
        payment status, and other information needed to confirm and fulfil
        your order. We do not intend to store full payment card details on our
        own servers.
      </p>
    ),
  },
  {
    title: "5. Service Providers and Sharing",
    content: (
      <p>
        We may share necessary information with service providers that help us
        operate the website, authenticate accounts, host or store data, process
        payments, deliver orders, provide customer support, and protect against
        fraud. We may also disclose information when required by law or
        necessary to protect our rights, customers, and services. We do not
        sell personal information as a business practice.
      </p>
    ),
  },
  {
    title: "6. Data Storage and Security",
    content: (
      <p>
        We use third-party infrastructure and reasonable technical and
        organisational safeguards to protect personal information. No online
        service can guarantee absolute security. Information may be retained
        for as long as necessary to provide services, maintain business
        records, resolve disputes, and comply with applicable law.
      </p>
    ),
  },
  {
    title: "7. Cookies and Similar Technologies",
    content: (
      <p>
        Our website and service providers may use cookies or similar
        technologies to support essential website functions, maintain sessions,
        improve performance, and protect security. You can manage cookies
        through your browser settings, although disabling some cookies may
        affect website functionality.
      </p>
    ),
  },
  {
    title: "8. Your Choices and Rights",
    content: (
      <p>
        Depending on applicable law, you may have rights to request access to,
        correction of, or deletion of your personal information, or to withdraw
        consent where processing is based on consent. Some information may need
        to be retained for legal, security, or transaction-related reasons.
        Contact us using the details below to make a request.
      </p>
    ),
  },
  {
    title: "9. Children’s Privacy",
    content: (
      <p>
        Our website is not intended for children who are not legally permitted
        to make purchases or use the service under applicable law. We do not
        knowingly collect personal information from children in violation of
        applicable law.
      </p>
    ),
  },
  {
    title: "10. Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy when our practices or legal
        requirements change. The updated version will be published on this
        page with a revised effective date.
      </p>
    ),
  },
  {
    title: "11. Contact Us",
    content: (
      <p>
        For privacy questions or requests concerning your personal
        information, please contact Kandid Luxury through the customer support
        contact details published on our website.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#F8F8F6] px-5 py-12 text-[#292923] sm:px-8 sm:py-16">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm text-[#77776D] transition hover:text-black"
        >
          ← Back to Kandid Luxury
        </Link>

        <header className="mt-10 border-b border-[#E5E3DC] pb-8">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#888579]">
            KANDID LUXURY
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-[#77776D]">
            Effective date: October 28, 2026
          </p>
          <p className="mt-6 leading-7 text-[#55554E]">
            Your privacy matters to us. This policy explains how Kandid Luxury
            collects, uses, stores, and shares information when you visit our
            website, sign in, or purchase our products.
          </p>
        </header>

        <div className="divide-y divide-[#E5E3DC]">
          {sections.map((section) => (
            <section key={section.title} className="py-7">
              <h2 className="font-serif text-xl sm:text-2xl">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-[#55554E] sm:text-base">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-6 border-t border-[#E5E3DC] pt-6 text-sm leading-6 text-[#77776D]">
          © {new Date().getFullYear()} Kandid Luxury. All rights reserved.
        </footer>
      </article>
    </main>
  );
}
