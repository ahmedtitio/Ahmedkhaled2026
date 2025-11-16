// src/app/layout.tsx
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// خط عربي احتياطي
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

/**
 * ---------------------------
 * تخصيص: عدّل هذه القيم قبل النشر
 * ---------------------------
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ahmedkhaled-me.vercel.app";
const SITE_NAME = "Ahmed Khaled";
const DEFAULT_TITLE = "Ahmed Khaled — Web Developer";
const DEFAULT_DESCRIPTION =
  "Ahmed Khaled — Web Developer. Portfolio, projects and contact information.";
const DEFAULT_IMAGE = process.env.NEXT_PUBLIC_SITE_URL
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png`
  : `/logo.png`;

export const metadata: Metadata = {
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Ahmed Khaled",
  },
  description: DEFAULT_DESCRIPTION,
  authors: [{ name: "Ahmed Khaled", url: SITE_URL }],
  keywords: [
    "Ahmed Khaled",
    "Web Developer",
    "Frontend",
    "React",
    "Next.js",
    "JavaScript",
    "TypeScript",
  ],
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_IMAGE,
        width: 1200,
        height: 630,
        alt: "Ahmed Khaled",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_IMAGE],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-US": `${SITE_URL}/`,
      ar: `${SITE_URL}/ar`,
    },
  },
  icons: {
    apple: "/apple-touch-icon.png",
    icon: "/favicon.ico",
    other: [
      { rel: "icon", url: "/favicon-32x32.png" },
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // استخدم جميع الخطوط لتفادي تحذيرات ESLint عن المتغير غير المستخدم
        className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} antialiased`}
      >
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <SpeedInsights />
            <Analytics />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
