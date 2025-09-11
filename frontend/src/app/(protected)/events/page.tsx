import Event from "@/components/entities/event";
import SearchInput from "@/components/ui/search-input";
import React from "react";

export default function Events() {
  return (
    <div className="pb-30 flex justify-center flex-wrap items-center max-h-[90vh] overflow-y-auto gap-4">
      <SearchInput />
      <Event />
      <Event />
      <Event />
    </div>
  );
}
