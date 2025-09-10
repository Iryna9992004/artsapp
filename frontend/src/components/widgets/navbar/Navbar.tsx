"use client";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "react-feather";

import { pathnames } from "./pathnames";

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <div className="sticky top-0 left-0 right-0 w-full h-fit bg-black px-8 py-4 border-b border-white/20 flex items-center gap-4 z-1000">
      <ChevronLeft
        className="text-white cursor-pointer"
        onClick={() => router.back()}
      />
      <h1 className="text-white font-bold text-2xl">
        {pathnames[pathname as never] || searchParams.get("message")}
      </h1>
    </div>
  );
}
