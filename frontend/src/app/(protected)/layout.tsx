"use client";
import Toast from "@/components/ui/toast";
import Navbar from "@/components/widgets/navbar";
import Tabbar from "@/components/widgets/tabbar";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, Suspense } from "react";

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
        } else {
          const data = await response.json();
          localStorage.setItem("user_id", data?.data?.user?.id);
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
      <div className="w-200 max-w-full bg-black/50 ">
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
        </Suspense>
        {children}
        <Suspense fallback={<div>Loading...</div>}>
          <Tabbar />
        </Suspense>
      </div>
    </div>
  );
}
