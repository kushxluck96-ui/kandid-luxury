import Link from "next/link";

const sections = [
  {
    title: "Hero",
    description: "Edit your landing section",
    href: "/admin/hero",
    icon: "🏠",
  },
  {
    title: "About",
    description: "Manage the About section",
    href: "/admin/about",
    icon: "✨",
  },
  {
    title: "Products",
    description: "Manage products",
    href: "/admin/products",
    icon: "🛍️",
  },
  {
  title: "Orders",
  description: "View customer orders and manage fulfillment",
  href: "/admin/orders",
  icon: "📦",
  },
  {
    title: "Testimonials",
    description: "Customer reviews",
    href: "/admin/testimonials",
    icon: "⭐",
  },
  {
    title: "FAQ",
    description: "Frequently asked questions",
    href: "/admin/faq",
    icon: "❓",
  },
  {
    title: "Contact",
    description: "Contact information",
    href: "/admin/contact",
    icon: "📞",
  },
  {
    title: "SEO",
    description: "Meta title & description",
    href: "/admin/seo",
    icon: "📈",
  },
  {
    title: "Settings",
    description: "Website settings",
    href: "/admin/settings",
    icon: "⚙️",
  },
];

export default function AdminDashboard() {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="mt-2 text-neutral-500">
          Welcome back! Select a section to edit.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-4 text-4xl">{section.icon}</div>

            <h2 className="text-xl font-semibold group-hover:text-black">
              {section.title}
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}