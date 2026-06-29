import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kandidluxury.com"),

  title: {
    default: "Kandid Luxury",
    template: "%s | Kandid Luxury",
  },

  description:
    "Discover Kandid Luxury's premium 100% Pure Pearl Powder for radiant, healthy, and glowing skin. Luxury skincare crafted for beauty enthusiasts.",

  keywords: [
    "Kandid Luxury",
    "Pearl Powder",
    "Pure Pearl Powder",
    "Luxury Skincare",
    "Beauty Products",
    "Skin Care Nepal",
    "Cosmetics Nepal",
    "Glowing Skin",
    "Natural Beauty",
  ],

  authors: [
    {
      name: "Kandid Luxury",
    },
  ],

  creator: "Kandid Luxury",
  publisher: "Kandid Luxury",

  openGraph: {
    title: "Kandid Luxury",
    description:
      "Premium 100% Pure Pearl Powder for radiant, healthy, and glowing skin.",
    url: "https://kandidluxury.com",
    siteName: "Kandid Luxury",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kandid Luxury",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Kandid Luxury",
    description:
      "Premium 100% Pure Pearl Powder for radiant, healthy skin.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}