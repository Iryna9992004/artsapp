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
      "linear-gradient(135deg, #3b0a77 0%, #330865 30%, #1e0640 60%, #0f0e2f 85%, #000000 100%)",
  };

  return (
    <html lang="en">
      <body style={linearGradient} className="flex h-[100vh] w-full">
        {children}
      </body>
    </html>
  );
}
