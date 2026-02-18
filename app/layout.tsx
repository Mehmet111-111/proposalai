import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProposalAI - AI-Powered Proposal Generator for Freelancers",
  description:
    "Create professional proposals in seconds with AI. Track client engagement, automate invoicing, and win more clients.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body className={`${inter.className} bg-white text-slate-900`}>{children}</body>
    </html>
  );
}
