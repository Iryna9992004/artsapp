import Navbar from "@/components/widgets/navbar";
import Tabbar from "@/components/widgets/tabbar";
import React from "react";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full mx-auto bg-opacity-20 overflow-y-auto flex justify-center">
      <div className="w-200 max-w-full bg-black/50">
        <Navbar />
        {children}
        <Tabbar />
      </div>
    </div>
  );
}
