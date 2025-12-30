import ChatMessage from "@/components/entities/chat-message/ChatMessage";
import React, { useEffect, useRef } from "react";
import { MessageListProps } from "./types";
import { useUserId } from "@/shared/hooks/user/useUserId";

export default function MessagesList({ data }: MessageListProps) {
  const messagesListRef = useRef<any>(null);
  const { userId } = useUserId();

  useEffect(() => {
    messagesListRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [data]);

  const getStatus = (item: { user_id: number; reads_count: string }) => {
    if (item.user_id === userId && Number(item.reads_count) > 0) {
      return "read";
    }
    if (item.user_id === userId) {
      return "sent";
    }
    return "sent";
  };

  return (
    <div ref={messagesListRef} className="overflow-y-auto pb-20">
      {data.map((item) => (
        <ChatMessage
          key={item.id}
          id={item.id}
          text={item.text}
          timestamp={item.created_at}
          author={item.author_name}
          user_id={item.user_id}
          colorNumber={String(item.id % 10)}
          status={getStatus(item)}
        />
      ))}
    </div>
  );
}
