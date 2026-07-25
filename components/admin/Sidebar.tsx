"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/admin" },
  { name: "Hero", href: "/admin/hero" },
  { name: "About", href: "/admin/about" },
  { name: "Products", href: "/admin/products" },
  { name: "Testimonials", href: "/admin/testimonials" },
  { name: "FAQ", href: "/admin/faq" },
  { name: "Contact", href: "/admin/contact" },
  { name: "Settings", href: "/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-white border-r min-h-screen">
      <div className="p-8 border-b">
        <h1 className="text-3xl font-serif">
          Kandid CMS
        </h1>

        <p className="text-sm text-neutral-500 mt-1">
          Luxury Admin
        </p>
      </div>

      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded-xl px-4 py-3 transition ${
              pathname === link.href
                ? "bg-black text-white"
                : "hover:bg-neutral-100"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}