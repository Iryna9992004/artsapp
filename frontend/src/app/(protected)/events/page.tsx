"use client";
import SearchInput from "@/components/features/search-input";
import React, { useState } from "react";

export const dynamic = "force-dynamic";

export default function Events() {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  return (
    <div className="pb-30 flex justify-center flex-wrap items-center max-h-[90vh] overflow-y-auto gap-4">
      <SearchInput setValue={setSearchText} />
    </div>
  );
}
