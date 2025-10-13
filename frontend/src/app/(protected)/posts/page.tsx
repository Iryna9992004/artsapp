import SearchInput from "@/components/features/search-input";
import React from "react";

export const dynamic = "force-dynamic";

export default function Posts() {
  return (
    <div className="flex flex-col pb-40 max-h-[90vh] overflow-y-auto">
      <SearchInput />
      <div className="flex flex-col w-full px-6 gap-5"></div>
    </div>
  );
}
