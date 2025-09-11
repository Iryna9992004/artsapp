import Post from "@/components/entities/post";
import SearchInput from "@/components/ui/search-input";
import React from "react";

export default function Posts() {
  return (
    <div className="flex flex-col pb-40 max-h-[90vh] overflow-y-auto">
      <SearchInput />
      <div className="flex flex-col w-full px-6 gap-5">
        <Post />
        <Post />
      </div>
    </div>
  );
}
