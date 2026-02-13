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
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          router.replace("/login");
          return;
        }
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });
        if (!response.ok) {
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("accessToken");
          router.replace("/login");
        } else {
          const data = await response.json();
          // Update tokens if new ones are provided
          if (data.data?.refreshToken) {
            localStorage.setItem("refreshToken", data.data.refreshToken);
          }
          if (data.data?.accessToken) {
            localStorage.setItem("accessToken", data.data.accessToken);
          }
          if (data.data?.user?.id) {
            localStorage.setItem("user_id", data.data.user.id.toString());
          }
        }
      } catch (e) {
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
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
