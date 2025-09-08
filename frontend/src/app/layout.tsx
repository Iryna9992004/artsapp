import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Artsapp",
  description: "The app for thinkers and feelers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const linearGradient = {
    background:
      "linear-gradient(135deg, #2a064e 0%, #1a0433 25%, #0f0e2f 45%, #000000 80%, #000000 100%)",
  };

  return (
    <html lang="en">
      <body style={linearGradient} className="flex h-[100vh] w-full">
        {children}
      </body>
    </html>
  );
}
