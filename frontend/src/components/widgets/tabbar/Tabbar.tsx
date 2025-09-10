"use client";
import React, { useMemo } from "react";
import { tabs } from "./tabs";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Tabbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pathMatch = useMemo(() => {
    console.log("-=-=", pathname, tabs);
    if (searchParams.toString().length === 0) return true;
    else return false;
  }, [pathname, searchParams]);
  return (
    <div className="w-full fixed bottom-0 left-0 right-0 flex items-center justify-center pb-2 px-4">
      <div className="max-w-full w-fit flex justify-center gap-2 bg-gray/80 rounded-2xl border border-white/30 p-2">
        {pathMatch &&
          tabs.map((item) => (
            <Link href={item.path} key={item.path}>
              <div
                className={`flex flex-col w-30 gap-1 items-center justify-center py-4 px-6 rounded-lg text-md text-white cursor-pointer hover:bg-linear-to-t hover:from-purple-900 transition duration-700 ease-in-out ${pathname.includes(item.path) ? "bg-linear-to-t from-purple-900" : ""}`}
              >
                <item.icon />
                <span>{item.name}</span>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
