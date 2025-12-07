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
  title: "BeforeYouSign | Executive Contract Intelligence",
  description: "Institutional-grade contract analysis powered by AI. Identify material risks, decode complex provisions, and safeguard your commercial interests.",
  keywords: "contract analysis, legal AI, risk assessment, contract review, legal intelligence",
  authors: [{ name: "BeforeYouSign" }],
  openGraph: {
    title: "BeforeYouSign | Executive Contract Intelligence",
    description: "Institutional-grade contract analysis powered by AI",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
