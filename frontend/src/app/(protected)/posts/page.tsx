import Post from "@/components/entities/post";
import React from "react";

export default function Posts() {
  return (
    <div className="flex flex-col gap-5 p-6 pb-40 max-h-[95%] overflow-y-auto">
      <Post />
      <Post />
    </div>
  );
}
