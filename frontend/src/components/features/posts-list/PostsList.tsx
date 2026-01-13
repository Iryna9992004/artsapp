"use client";
import Post from "@/components/entities/post";
import { useFetchPosts } from "@/shared/hooks/posts/useFetchPosts";
import React, { useEffect, useState } from "react";
import { PostsListProps } from "./types";
import { useOnInView } from "react-intersection-observer";
import Loader from "@/components/ui/loader";

export default function PostsList({ searchText }: PostsListProps) {
  const [lastIndex, setLastIndex] = useState(0);
  const { posts, isLoading, hasMore } = useFetchPosts(
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

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Recently";
      
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (e) {
      return "Recently";
    }
  };

  return (
    <div className="flex flex-col w-full px-6 gap-6 pb-10">
      {posts.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-6xl">🎵</div>
          <p className="text-xl text-gray-400">No posts yet</p>
          <p className="text-sm text-gray-500">Be the first to share your thoughts!</p>
        </div>
      )}
      {posts.map((item, index) => (
        <div
          key={`post-${item.id}-${index}`}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <Post
            title={item.title}
            description={item.post_description}
            author={item.author_name || "Unknown Author"}
            date={formatDate(item.created_at)}
            author_occupation="Musician"
          />
        </div>
      ))}
      {isLoading && posts.length > 0 && (
        <div className="flex items-center justify-center py-8">
          <Loader />
        </div>
      )}
      <div ref={trackingRef} className="h-10 w-full" />
    </div>
  );
}

