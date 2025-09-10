import Tabbar from "@/components/widgets/tabbar";
import React from "react";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full bg-opacity-20 overflow-y-auto flex justify-center">
      {children}
      <Tabbar />
    </div>
  );
}
