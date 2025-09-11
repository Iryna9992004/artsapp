"use client";
import React, { useState } from "react";
import { MessageSquare } from "react-feather";
import FeedReply from "../feed-reply";
import { colors } from "./colors";
import { FeedMessageProps } from "./types";
import { useRouter } from "next/navigation";

const FeedMessage: React.FC<FeedMessageProps> = ({
  text,
  timestamp,
  isMine,
  messagesCount = 0,
  colorNumber = "1",
}) => {
  const [repliesOpened, setRepliesOpened] = useState(false);
  const router = useRouter();

  const getColorConfig = (colorNum: string | number) => {
    const key = String(colorNum) as unknown;
    return colors[
      key as "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10"
    ];
  };

  const pushToChat = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/feed/chat/1?title=${encodeURIComponent(text)}`);
  };

  return (
    <div className={`w-full flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className="relative flex justify-end mb-4 px-4 min-w-80 w-[30%] max-w-[45%] cursor-pointer"
        onClick={() => setRepliesOpened(!repliesOpened)}
      >
        <div className="w-full">
          <div
            className={`${getColorConfig(colorNumber).border} text-white rounded-2xl p-[1px] relative`}
          >
            <div
              className={`${getColorConfig(colorNumber).bg} text-white rounded-2xl px-4 py-3 relative`}
            >
              <a
                className="text-md leading-relaxed cursor-pointer"
                onClick={pushToChat as never}
              >
                {text}
              </a>
              <div className="flex items-center justify-between mt-1 space-x-2">
                <span className="text-xs text-gray-200">{timestamp}</span>

                <div className="flex gap-2 items-center">
                  <div className="text-gray-200 flex items-center gap-1">
                    <span className="text-xs">{messagesCount}</span>
                    <MessageSquare className="w-4" />
                  </div>
                </div>
              </div>

              {repliesOpened ? (
                <div className="flex flex-col gap-1 w-full pt-2">
                  <FeedReply onClick={pushToChat} />
                  <FeedReply onClick={pushToChat} />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {isMine ? (
          <div
            className={`absolute right-[9px] -bottom-[4px] w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[12px] ${getColorConfig(colorNumber).rightCorner} transform -rotate-226`}
          />
        ) : (
          <div
            className={`absolute left-[9px] -bottom-[4px] w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[12px] ${getColorConfig(colorNumber).leftCorner} transform rotate-226`}
          />
        )}
      </div>
    </div>
  );
};

export default FeedMessage;
