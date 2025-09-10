import Post from "@/components/entities/post";
import React from "react";

export default function Posts() {
  return (<div className="flex flex-col p-6 overflow-y-auto pb-30">
    <Post />
  </div>);
}
