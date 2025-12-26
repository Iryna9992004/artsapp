"use client";
import TopicsList from "@/components/features/topics-list";
import SearchInput from "@/components/features/search-input";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function Feed() {
  const [searchText, setSearchText] = useState<string | undefined>();
  return (
    <div className="pb-30 relative max-h-[90vh] overflow-y-auto">
      <SearchInput setValue={setSearchText} />
      <TopicsList searchText={searchText} />
      <div className="pt-10" />
    </div>
  );
}
