import ChatMessage from "@/components/entities/chat-message/ChatMessage";
import React, { useEffect, useRef } from "react";
import { MessageListProps } from "./types";

export default function MessagesList({ data }: MessageListProps) {
  const messagesListRef = useRef<any>(null);

  useEffect(() => {
    messagesListRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [data]);
  return (
    <div ref={messagesListRef} className="overflow-y-auto pb-20">
      {data.map((item) => (
        <ChatMessage
          key={item.id}
          text={item.text}
          timestamp={item.created_at}
          author={item.author_name}
          user_id={item.user_id}
          colorNumber={String(item.id % 10)}
          status={Number(item.reads_count) > 0 ? "read" : "sent"}
        />
      ))}
    </div>
  );
}
