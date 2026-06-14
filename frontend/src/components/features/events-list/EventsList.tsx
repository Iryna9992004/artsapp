"use client";
import Event from "@/components/entities/event";
import { useFetchEvents } from "@/shared/hooks/events/useFetchEvents";
import React, { useEffect, useMemo, useState } from "react";
import { EventsListProps } from "./types";
import { useOnInView } from "react-intersection-observer";
import Loader from "@/components/ui/loader";
import { usePendingItem } from "@/shared/hooks/usePendingItem";
import { PENDING_KEYS } from "@/shared/lib/pendingItem";

interface EventItem {
  id: number;
  title: string;
  event_description: string;
  created_at: string;
  author_name: string;
}

export default function EventsList({ searchText }: EventsListProps) {
  const [lastIndex, setLastIndex] = useState(0);
  const { events, isLoading, hasMore, fetch } = useFetchEvents(
    lastIndex,
    10,
    searchText
  );
  const isLoadingRef = React.useRef(false);
  const lastIncrementRef = React.useRef<number>(0);

  // Оптимістично доданий айтем (щойно створений), поки триває реплікація.
  const { item: pending, clear: clearPending } = usePendingItem<EventItem>(
    PENDING_KEYS.event
  );
  const reconcileTries = React.useRef(0);

  const displayedEvents = useMemo(() => {
    if (!pending || searchText) return events as EventItem[];
    if (events.some((e: EventItem) => e.id === pending.id))
      return events as EventItem[];
    return [pending, ...(events as EventItem[])];
  }, [events, pending, searchText]);

  // Реконсиляція: коли реплікований айтем приходить з бекенду — прибираємо
  // оптимістичний; доти періодично перезапитуємо список (макс. 5 спроб).
  useEffect(() => {
    if (!pending) {
      reconcileTries.current = 0;
      return;
    }
    if (events.some((e: EventItem) => e.id === pending.id)) {
      clearPending();
      return;
    }
    if (reconcileTries.current >= 5) return;
    const timer = setTimeout(() => {
      reconcileTries.current += 1;
      fetch();
    }, 2000);
    return () => clearTimeout(timer);
  }, [pending, events, fetch, clearPending]);

  // Debug logging
  React.useEffect(() => {
    console.log('EventsList - events updated:', events.length, 'isLoading:', isLoading, 'hasMore:', hasMore);
  }, [events, isLoading, hasMore]);

  // Update ref when isLoading changes
  React.useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const trackingRef = useOnInView(
    React.useCallback((inView: boolean) => {
      if (inView && !isLoadingRef.current && hasMore) {
        const now = Date.now();
        // Throttle: only increment if last increment was more than 500ms ago
        if (now - lastIncrementRef.current > 500) {
          lastIncrementRef.current = now;
          setLastIndex((prev) => prev + 10);
        }
      }
    }, [hasMore]),
    {
      threshold: 0.5,
      triggerOnce: false,
      rootMargin: '100px', // Start loading earlier
    }
  );

  // Reset offset when searchText changes or component remounts
  useEffect(() => {
    setLastIndex(0);
    lastIncrementRef.current = 0;
  }, [searchText]);

  if (isLoading && displayedEvents.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full px-6 pb-10">
      {displayedEvents.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-6xl">🎭</div>
          <p className="text-xl text-gray-400">No events yet</p>
          <p className="text-sm text-gray-500">Share your first musical event!</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedEvents.map((item, index) => (
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
      {isLoading && displayedEvents.length > 0 && (
        <div className="flex items-center justify-center py-8">
          <Loader />
        </div>
      )}
      <div ref={trackingRef} className="h-10 w-full" />
    </div>
  );
}
