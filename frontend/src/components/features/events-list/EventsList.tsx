"use client";
import Event from "@/components/entities/event";
import { useFetchEvents } from "@/shared/hooks/events/useFetchEvents";
import React, { useEffect, useState } from "react";
import { EventsListProps } from "./types";
import { useOnInView } from "react-intersection-observer";

export default function EventsList({ searchText }: EventsListProps) {
  const [lastIndex, setLastIndex] = useState(0);
  const { events, isLoading, hasMore } = useFetchEvents(
    lastIndex,
    10,
    searchText
  );

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

  console.log("events", events);

  useEffect(() => {
    setLastIndex(0);
  }, [searchText]);

  return (
    <div className="grid grid-cols-2 gap-5">
      {events.map((item) => (
        <Event
          key={item.id}
          title={item.title}
          description={item.event_description}
          author={item.author_name}
          date={item.created_at}
        />
      ))}
      <div ref={trackingRef} className="h-10 w-full" />
    </div>
  );
}
