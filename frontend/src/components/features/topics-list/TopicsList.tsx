"use client";
import FeedMessage from "@/components/entities/feed-message";
import React, { useEffect, useMemo, useState } from "react";
import { TopicsListProps } from "./types";
import { useOnInView } from "react-intersection-observer";
import { useTopics } from "@/shared/hooks/topic/useTopics";
import Loader from "@/components/ui/loader";
import { usePendingItem } from "@/shared/hooks/usePendingItem";
import { PENDING_KEYS } from "@/shared/lib/pendingItem";

interface TopicItem {
  id: number;
  text: string;
  author_name: string;
  created_at: string;
}

export default function TopicsList({ searchText }: TopicsListProps) {
  const [lastIndex, setLastIndex] = useState(0);
  const { isLoading, topics, hasMore, fetch } = useTopics(
    lastIndex,
    10,
    searchText
  );
  const isLoadingRef = React.useRef(false);

  // Оптимістично додана тема (щойно створена), поки триває реплікація.
  const { item: pending, clear: clearPending } = usePendingItem<TopicItem>(
    PENDING_KEYS.topic
  );
  const reconcileTries = React.useRef(0);

  const displayedTopics = useMemo(() => {
    if (!pending || searchText) return topics as TopicItem[];
    if (topics.some((t: TopicItem) => t.id === pending.id))
      return topics as TopicItem[];
    return [pending, ...(topics as TopicItem[])];
  }, [topics, pending, searchText]);

  useEffect(() => {
    if (!pending) {
      reconcileTries.current = 0;
      return;
    }
    if (topics.some((t: TopicItem) => t.id === pending.id)) {
      clearPending();
      return;
    }
    if (reconcileTries.current >= 5) return;
    const timer = setTimeout(() => {
      reconcileTries.current += 1;
      fetch();
    }, 2000);
    return () => clearTimeout(timer);
  }, [pending, topics, fetch, clearPending]);
  const lastIncrementRef = React.useRef<number>(0);

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
          setLastIndex((prev) => {
            const next = prev + 10;
            return next;
          });
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

  if (isLoading && displayedTopics.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="px-6">
      {displayedTopics.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-6xl">💬</div>
          <p className="text-xl text-gray-400">No topics yet</p>
          <p className="text-sm text-gray-500">Start a conversation!</p>
        </div>
      )}
      {displayedTopics.map((item, index) => (
        <div
          key={`topic-${item.id}-${index}`}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.03}s` }}
        >
        <FeedMessage
          id={item.id}
          text={item.text}
          timestamp={item.created_at}
          author={item.author_name}
          colorNumber={item.id % 10}
        />
        </div>
      ))}
      {isLoading && displayedTopics.length > 0 && (
        <div className="flex items-center justify-center py-8">
          <Loader />
        </div>
      )}
      <div ref={trackingRef} className="h-10 w-full" />
    </div>
  );
}
