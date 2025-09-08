import React from "react";
import { MessageSquare } from "react-feather";
import { ChatMessageProps } from "../chat-message/types";
import FeedReply from "../feed-reply";

const FeedMessage: React.FC<ChatMessageProps> = ({
  text,
  timestamp,
  isMine,
  messagesCount = 0,
}) => {
  return (
    <div className={`w-full flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className="relative flex justify-end mb-4 px-4 min-w-[80px] max-w-[35%]">
        <div className="w-full">
          <div className="bg-gradient-to-br from-[#1E25B1] to-[#734AD7] text-white rounded-2xl p-[1px] relative">
            <div className="bg-gradient-to-br from-[#1320AA] to-[#5B31AF] text-white rounded-2xl px-4 py-3 relative">
              <p className="text-md leading-relaxed">{text}</p>
              <div className="flex items-center justify-between mt-1 space-x-2">
                <span className="text-xs text-gray-200">{timestamp}</span>

                <div className="flex gap-2 items-center">
                  <div className="text-gray-200 flex items-center gap-1">
                    <span className="text-xs">{messagesCount}</span>
                    <MessageSquare className="w-4" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 w-full pt-2">
                <FeedReply />
                <FeedReply />
              </div>
            </div>
          </div>
        </div>

        {isMine ? (
          <div className="absolute right-[9px] -bottom-[4px] w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[12px] border-b-[#7E42FF] transform -rotate-226" />
        ) : (
          <div className="absolute left-[9px] -bottom-[4px] w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[12px] border-b-[#7E42FF] transform rotate-226" />
        )}
      </div>
    </div>
  );
};

export default FeedMessage;
