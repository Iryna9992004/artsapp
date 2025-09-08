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
      <body style={linearGradient}>
        <div className="relative flex h-[100vh] w-full">
          <div className="absolute inset-0 bg-[url(/stars.gif)] bg-cover bg-center opacity-20"></div>
          <div className="relative z-10 flex h-full w-full">{children}</div>
        </div>
      </body>
    </html>
  );
}
