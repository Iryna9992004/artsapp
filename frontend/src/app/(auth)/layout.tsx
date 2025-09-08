import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gradient-to-bl from-[#1e0033] to-[#4a0057] h-[100vh] w-full">
      <div className="relative flex h-[100vh] w-full">
        <div className="absolute inset-0 bg-[url(/stars.gif)] bg-cover bg-center opacity-50"></div>
        <div className="relative z-10 flex h-full w-full">{children}</div>
      </div>
    </div>
  );
}
