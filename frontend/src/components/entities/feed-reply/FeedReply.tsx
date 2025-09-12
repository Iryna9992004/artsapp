import React from "react";
import { CornerDownRight } from "react-feather";
import { FeedReplyProps } from "./types";

export default function FeedReply({ author, text, onClick }: FeedReplyProps) {
  return (
    <button
      name="feed-reply"
      className="bg-black/50 p-4 flex flex-col rounded-lg cursor-pointer"
      onClick={onClick as never}
    >
      <div className="flex items-start gap-2">
        <CornerDownRight className="text-red-700 w-4" />
        <span className="text-white font-bold text-sm">{author}</span>
      </div>
      <span className="text-white/80 text-sm pl-6 text-start">{text}</span>
    </button>
  );
}
