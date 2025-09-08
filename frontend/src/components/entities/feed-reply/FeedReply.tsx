import React from "react";
import { CornerDownRight } from "react-feather";

export default function FeedReply() {
  return (
    <div className="bg-black/50 p-4 flex flex-col rounded-lg cursor-pointer">
      <div className="flex items-center gap-2">
        <CornerDownRight className="text-red-700 w-4" />
        <span className="text-white font-bold text-sm">Username</span>
      </div>
      <span className="text-white/80 text-sm pl-6">Some message in here</span>
    </div>
  );
}
