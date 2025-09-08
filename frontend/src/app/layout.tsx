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
  return (
    <html lang="en">
    <body className="bg-gradient-to-bl from-[#1e0033] to-[#4a0057]">
        <div className="relative flex h-[100vh] w-full">
          <div className="absolute inset-0 bg-[url(/stars.gif)] bg-cover bg-center opacity-50"></div>
          <div className="relative z-10 flex h-full w-full">{children}</div>
        </div>
      </body>
    </html>
  );
}
