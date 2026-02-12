"use client";

import SearchInput from "@/components/features/search-input";
import PostsList from "@/components/features/posts-list";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Posts() {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);
  const pathname = usePathname();
  const lastRefreshRef = useRef<number>(0);

  // Refresh list when navigating to /posts after creating a post
  useEffect(() => {
    if (pathname === '/posts') {
      // Check if we just created a post using sessionStorage
      const postCreated = typeof window !== 'undefined' 
        ? sessionStorage.getItem('postCreated') 
        : null;
      
      if (postCreated) {
        const createdTime = parseInt(postCreated, 10);
        const now = Date.now();
        // Only refresh if post was created recently (within last 5 seconds)
        if (now - createdTime < 5000 && now - lastRefreshRef.current > 1000) {
          lastRefreshRef.current = now;
          // Clear the flag
          sessionStorage.removeItem('postCreated');
          // Small delay to ensure component is mounted and replication is complete
          const timer = setTimeout(() => {
            setRefreshKey(prev => prev + 1);
          }, 500);
          return () => clearTimeout(timer);
        } else if (now - createdTime >= 5000) {
          // Clean up old flag
          sessionStorage.removeItem('postCreated');
        }
      }
    }
  }, [pathname]);

  // Refresh list when page becomes visible or focused (with throttling)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        if (now - lastRefreshRef.current > 2000) {
          lastRefreshRef.current = now;
          setRefreshKey(prev => prev + 1);
        }
      }
    };

    const handleFocus = () => {
      const now = Date.now();
      if (now - lastRefreshRef.current > 2000) {
        lastRefreshRef.current = now;
        setRefreshKey(prev => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  
  return (
    <div className="flex flex-col pb-40 max-h-[90vh] overflow-y-auto">
      <SearchInput setValue={setSearchText} />
      <PostsList key={refreshKey} searchText={searchText} />
    </div>
  );
}
