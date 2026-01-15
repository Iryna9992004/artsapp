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
    <div className="w-full px-6 pb-10">
      {events.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-6xl">🎭</div>
          <p className="text-xl text-gray-400">No events yet</p>
          <p className="text-sm text-gray-500">Share your first musical event!</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((item, index) => (
          <div
            key={`event-${item.id}-${index}`}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
        <Event
          title={item.title}
          description={item.event_description}
          author={item.author_name}
          date={item.created_at}
        />
          </div>
      ))}
      </div>
      {isLoading && events.length > 0 && (
        <div className="flex items-center justify-center py-8">
          <Loader />
        </div>
      )}
      <div ref={trackingRef} className="h-10 w-full" />
    </div>
  );
}
