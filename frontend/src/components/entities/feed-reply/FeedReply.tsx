import React from "react";
import { CornerDownRight } from "react-feather";
import { FeedReplyProps } from "./types";

export default function FeedReply({ onClick }: FeedReplyProps) {
  return (
    <button
      className="bg-black/50 p-4 flex flex-col rounded-lg cursor-pointer"
      onClick={onClick as never}
    >
      <div className="flex items-center gap-2">
        <CornerDownRight className="text-red-700 w-4" />
        <span className="text-white font-bold text-sm">Username</span>
      </div>
      <span className="text-white/80 text-sm pl-6">Some message in here</span>
    </button>
  );
}
