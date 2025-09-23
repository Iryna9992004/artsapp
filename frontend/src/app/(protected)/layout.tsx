"use client";
import Navbar from "@/components/widgets/navbar";
import Tabbar from "@/components/widgets/tabbar";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function refresh() {
      try {
        const userSessionId = localStorage.getItem("userSessionId");
        if (!userSessionId) {
          router.replace("/login");
        }
        const response = await fetch(`/api/auth/refresh/${userSessionId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          router.replace("/login");
        }
      } catch (e) {
        router.replace("/login");
        console.error(e);
      }
    }
    refresh();
  }, [pathname, router]);

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
