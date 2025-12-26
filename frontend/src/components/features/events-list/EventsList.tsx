"use client";
import FeedMessage from "@/components/entities/feed-message";
import React, { useState } from "react";
import { EventsListProps } from "./types";
import { useOnInView } from "react-intersection-observer";
import { useTopics } from "@/shared/hooks/topic/useTopics";

export default function EventsList({ searchText }: EventsListProps) {
  const [lastIndex, setLastIndex] = useState(0);
  const { isLoading, topics, hasMore } = useTopics(lastIndex, 10, searchText);

  const trackingRef = useOnInView(
    (inView) => {
      if (inView && !isLoading && hasMore) {
        setLastIndex((prev) => prev + 10);
      }
    },
    {
      threshold: 0.5,
      triggerOnce: false,
    }
  );

  return (
    <div>
      {topics.map((item) => (
        <FeedMessage
          key={item.id}
          text={item.text}
          timestamp={item.created_at}
          author={item.author_name}
          colorNumber={item.id % 10}
        />
      ))}
      <div ref={trackingRef} className="h-10 w-full" />
    </div>
  );
}
