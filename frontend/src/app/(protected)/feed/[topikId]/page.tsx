import ChatMessage from "@/components/entities/chat-message/ChatMessage";
import SendForm from "@/components/features/send-form";
import React from "react";

export default function Page() {
  return (
    <div className="p-2 max-h-[90vh] overflow-y-auto pb-20">
      <ChatMessage
        text="Text placeholder here"
        timestamp="3 mins ago"
        status="delivered"
        isMine
        colorNumber="1"
      />
      <ChatMessage
        text="Text placeholder here"
        timestamp="3 mins ago"
        status="delivered"
        isMine={false}
        colorNumber="2"
      />
      <ChatMessage
        text="Text placeholder here"
        timestamp="3 mins ago"
        status="delivered"
        isMine={false}
        colorNumber="3"
      />
      <ChatMessage
        text="Text placeholder here"
        timestamp="3 mins ago"
        status="delivered"
        isMine={false}
        colorNumber="4"
      />
      <ChatMessage
        text="Text placeholder here"
        timestamp="3 mins ago"
        status="delivered"
        isMine={false}
        colorNumber="5"
      />
      <ChatMessage
        text="Text placeholder here"
        timestamp="3 mins ago"
        status="delivered"
        isMine={false}
        colorNumber="6"
      />
      <ChatMessage
        text="Text placeholder here"
        timestamp="3 mins ago"
        status="delivered"
        isMine={false}
        colorNumber="7"
      />
      <ChatMessage
        text="Text placeholder here"
        timestamp="3 mins ago"
        status="delivered"
        isMine={false}
        colorNumber="8"
      />
      <ChatMessage
        text="Text placeholder here"
        timestamp="3 mins ago"
        status="delivered"
        isMine={false}
        colorNumber="9"
      />
      <ChatMessage
        text="Text placeholder here"
        timestamp="3 mins ago"
        status="delivered"
        isMine={false}
        colorNumber="10"
      />

      <SendForm />
    </div>
  );
}
