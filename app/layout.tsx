import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";

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
    default: "100% Pure Pearl Powder for Skin | Kandid Luxury",
    template: "%s | Kandid Luxury",
  },

  description:
    "Discover Kandid Luxury's 100% pure pearl powder for a refined skincare ritual and naturally luminous-looking skin.",

  alternates: {
    canonical: "/",
  },

  keywords: [
    "Kandid Luxury",
    "Pearl Powder",
    "Pure Pearl Powder",
    "pearl powder for face",
    "pearl powder skincare",
    "natural skincare",
    "luxury skincare Nepal",
  ],

  authors: [
    {
      name: "Kandid Luxury",
    },
  ],

  creator: "Kandid Luxury",
  publisher: "Kandid Luxury",

  openGraph: {
    title: "100% Pure Pearl Powder for Skin | Kandid Luxury",
    description:
      "A refined pearl powder skincare ritual for luminous-looking skin.",
    url: "https://kandidluxury.com",
    siteName: "Kandid Luxury",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "100% Pure Pearl Powder for Skin | Kandid Luxury",
    description:
      "A refined pearl powder skincare ritual for luminous-looking skin.",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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
      <body className="min-h-full flex flex-col">
  <CartProvider>
    {children}
  </CartProvider>
</body>
    </html>
  );
}
