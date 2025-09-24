import React, { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, LogOut, Plus } from "react-feather";

import { pathnames } from "./pathnames";
import { mainPaths } from "@/shared/paths/main-paths";

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleCreate = () => {
    if (pathname.includes("/feed")) router.push("/feed/create");
    if (pathname.includes("/posts")) router.push("/posts/create");
    if (pathname.includes("/events")) router.push("/events/create");
  };

  const handleLogout = async () => {
    const userSessionId = localStorage.getItem("userSessionId");
    if (!userSessionId) {
      router.replace("/login");
    }
    try {
      const response = await fetch(`/api/auth/logout/${userSessionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        localStorage.removeItem("userSessionId");
        router.replace("/login");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const showNavbar = useMemo(() => {
    if (
      pathname === "/feed/create" ||
      pathname === "/posts/create" ||
      pathname === "/events/create"
    )
      return true;
    if (searchParams.toString().length === 0) return false;

    return mainPaths.some(
      (p) => pathname === p || pathname.startsWith(p + "/")
    );
  }, [searchParams, pathname]);

  const isCreatePage = useMemo(() => {
    if (!pathname) return false;

    return (
      pathname === "/feed/create" ||
      pathname === "/posts/create" ||
      pathname === "/events/create"
    );
  }, [pathname]);

  return (
    <div className="sticky top-0 left-0 right-0 w-full h-fit bg-black px-8 py-4 border-b flex items-center justify-between gap-4 z-1000">
      <div className="flex items-center gap-2">
        {showNavbar ? (
          <ChevronLeft
            className="text-white cursor-pointer w-8"
            onClick={() => router.back()}
          />
        ) : null}
        <h1 className="text-white font-bold text-2xl">
          {pathnames[pathname as never] || searchParams.get("title")}
        </h1>
      </div>

      <div className="flex items-center gap-8">
        {!isCreatePage ? (
          <button onClick={() => handleCreate()} name="plus" area-label="plus">
            <div className="transform rotate-45 rounded-sm bg-pink-800 border border-white/60 p-1 cursor-pointer hover:bg-pink-900">
              <Plus className="text-white transform rotate-45" />
            </div>
          </button>
        ) : null}

        <LogOut className="text-white cursor-pointer" onClick={handleLogout} />
      </div>
    </div>
  );
}
