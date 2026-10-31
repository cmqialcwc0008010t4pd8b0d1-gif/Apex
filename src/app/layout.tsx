import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApexEdge Trading Academy | Institutional-Grade Financial Education",
  description: "A comprehensive, article-based financial education platform with interactive simulations, risk management mastery, and verified educational progression.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col antialiased selection:bg-teal-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
