import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buyer DNA — Property Preference Profile",
  description:
    "A short, intelligent property discovery experience that derives your Buyer DNA and a structured preference profile.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
