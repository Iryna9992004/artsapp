import type { Metadata } from "next";
import "./globals.css";
import Toast from "@/components/ui/toast";

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
      <body className="bg-gradient-to-bl from-blue-950 to-orange-950 h-[100vh] w-full">
        <div className="relative flex h-[100vh] w-full">
          <div className="absolute inset-0 bg-[url(/stars.gif)] bg-cover bg-center opacity-80" />
          <div className="relative z-10 flex h-full w-full">{children}</div>
        </div>
        <Toast />
      </body>
    </html>
  );
}
