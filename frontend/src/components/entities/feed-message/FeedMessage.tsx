import React from "react";

interface ChatMessageProps {
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  readCount?: number;
}

const FeedMessage: React.FC<ChatMessageProps> = ({
  text,
  timestamp,
  status,
  readCount = 0,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case "sent":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-gray-400"
          >
            <path
              d="M9 16.17L5.83 13l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
              fill="currentColor"
            />
          </svg>
        );
      case "delivered":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-gray-300"
          >
            <path
              d="M16.59 7.58L10 14.17L7.41 11.58L6 13L10 17L18 9L16.59 7.58Z"
              fill="currentColor"
            />
            <path
              d="M21.59 7.58L15 14.17L12.41 11.58L11 13L15 17L23 9L21.59 7.58Z"
              fill="currentColor"
            />
          </svg>
        );
      case "read":
        return (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="text-purple-300"
          >
            <path
              d="M16.59 7.58L10 14.17L7.41 11.58L6 13L10 17L18 9L16.59 7.58Z"
              fill="currentColor"
            />
            <path
              d="M21.59 7.58L15 14.17L12.41 11.58L11 13L15 17L23 9L21.59 7.58Z"
              fill="currentColor"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative flex justify-end mb-4 px-4 min-w-[80px] max-w-[35%]">
      <div className="w-full">
        <div className="bg-gradient-to-br from-[#1E25B1] to-[#734AD7] text-white rounded-2xl p-[1px] relative">
          <div className="bg-gradient-to-br from-[#1320AA] to-[#5B31AF] text-white rounded-2xl px-4 py-3 relative">
            <p className="text-md leading-relaxed">{text}</p>
            <div className="flex items-center justify-between mt-1 space-x-2">
              <span className="text-xs text-gray-200">{timestamp}</span>

              {getStatusIcon()}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-[9px] -bottom-[4px] w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[12px] border-b-[#7E42FF] transform -rotate-226" />
      <div className="absolute left-[9px] -bottom-[4px] w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[12px] border-b-[#7E42FF] transform rotate-226" />
    </div>
  );
};

export default FeedMessage;
