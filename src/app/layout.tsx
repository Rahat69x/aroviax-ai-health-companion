import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from "@/context/AccessibilityContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563EB",
};

export const metadata: Metadata = {
  title: "Aroviax — AI Health Companion",
  description:
    "Aroviax — AI Health Companion helps you understand general health information in simple language, organize your symptoms, and prepare clear questions for your healthcare provider. Not a doctor or diagnostic tool.",
  keywords: [
    "health information",
    "doctor appointment preparation",
    "symptom organizer",
    "medical questions helper",
    "plain language health",
    "healthcare AI assistant",
  ],
  authors: [{ name: "Aroviax Team" }],
  openGraph: {
    title: "Aroviax — AI Health Companion",
    description:
      "Understand general health terminology, organize your concerns, and prepare meaningful questions for your doctor.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#1E293B]">
        <AccessibilityProvider>{children}</AccessibilityProvider>
      </body>
    </html>
  );
}
