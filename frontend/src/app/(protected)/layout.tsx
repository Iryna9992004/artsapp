import React from "react";

export default function ProtectedLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="bg-black w-full h-full bg-opacity-20 overflow-y-auto">{children}</div>;
}
