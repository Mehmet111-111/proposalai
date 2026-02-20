import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProposalAI — AI-Powered Proposals for Freelancers",
  description:
    "Create professional proposals in seconds with AI. Track client engagement, automate invoicing, and win more clients. Free forever plan available.",
  metadataBase: new URL("https://proposalai.app"),
  openGraph: {
    title: "ProposalAI — AI-Powered Proposals for Freelancers",
    description: "Create professional proposals in seconds with AI. Win more clients, get paid faster.",
    url: "https://proposalai.app",
    siteName: "ProposalAI",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProposalAI — AI-Powered Proposals for Freelancers",
    description: "Create professional proposals in seconds with AI. Win more clients, get paid faster.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body className={`${inter.className} bg-white text-slate-900`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
