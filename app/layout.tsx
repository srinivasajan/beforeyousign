import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ToastProvider } from "@/components/ToastProvider";
import { ClerkProvider } from "@clerk/nextjs";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BeforeYouSign | Executive Contract Intelligence",
  description: "Institutional-grade contract analysis powered by AI. Identify material risks, decode complex provisions, and safeguard your commercial interests.",
  keywords: "contract analysis, legal AI, risk assessment, contract review, legal intelligence, contract management, legal tech, AI contract review",
  authors: [{ name: "BeforeYouSign" }],
  creator: "BeforeYouSign",
  publisher: "BeforeYouSign",
  robots: "index, follow",
  openGraph: {
    title: "BeforeYouSign | Executive Contract Intelligence",
    description: "Institutional-grade contract analysis powered by AI. Identify material risks, decode complex provisions, and safeguard your commercial interests.",
    type: "website",
    locale: "en_US",
    siteName: "BeforeYouSign",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeforeYouSign | Executive Contract Intelligence",
    description: "Institutional-grade contract analysis powered by AI",
  },
};

export const viewport: import("next").Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Security Headers via meta tags */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="geolocation=(), microphone=(), camera=()" />

        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://generativelanguage.googleapis.com" />

        {/* DNS Prefetch for faster lookups */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://generativelanguage.googleapis.com" />

        {/* Clerk preconnect */}
        <link rel="preconnect" href="https://clerk.clerk.services" />
        <link rel="preconnect" href="https://*.clerk.accounts.dev" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <ToastProvider>
            <ErrorBoundary>
              <Navbar />
              {children}
            </ErrorBoundary>
          </ToastProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
