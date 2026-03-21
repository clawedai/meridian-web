import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drishti — Complete Intelligence Platform",
  description: "Track competitors, monitor markets, and make data-driven decisions without the research overhead.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}
