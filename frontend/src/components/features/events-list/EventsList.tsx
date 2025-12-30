"use client";
import Event from "@/components/entities/event";
import { useFetchEvents } from "@/shared/hooks/events/useFetchEvents";
import React, { useEffect, useState } from "react";
import { EventsListProps } from "./types";
import { useOnInView } from "react-intersection-observer";
import Loader from "@/components/ui/loader";

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

  useEffect(() => {
    setLastIndex(0);
  }, [searchText]);

  if (isLoading && events.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

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
      {isLoading && events.length > 0 && (
        <div className="col-span-2 flex items-center justify-center py-8">
          <Loader />
        </div>
      )}
      <div ref={trackingRef} className="h-10 w-full col-span-2" />
    </div>
  );
}
