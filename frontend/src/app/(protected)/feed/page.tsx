"use client";
import TopicsList from "@/components/features/topics-list";
import SearchInput from "@/components/features/search-input";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Feed() {
  const [searchText, setSearchText] = useState<string | undefined>();
  const [debouncedSearchText, setDebouncedSearchText] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);
  const pathname = usePathname();
  const lastRefreshRef = useRef<number>(0);

  // Debounce search text to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchText]);

  // Refresh list when navigating to /feed after creating a topic
  useEffect(() => {
    if (pathname === '/feed') {
      // Check if we just created a topic using sessionStorage
      const topicCreated = typeof window !== 'undefined' 
        ? sessionStorage.getItem('topicCreated') 
        : null;
      
      if (topicCreated) {
        const createdTime = parseInt(topicCreated, 10);
        const now = Date.now();
        // Only refresh if topic was created recently (within last 5 seconds)
        if (now - createdTime < 5000 && now - lastRefreshRef.current > 1000) {
          lastRefreshRef.current = now;
          // Clear the flag
          sessionStorage.removeItem('topicCreated');
          // Small delay to ensure component is mounted and replication is complete
          const timer = setTimeout(() => {
            setRefreshKey(prev => prev + 1);
          }, 500);
          return () => clearTimeout(timer);
        } else if (now - createdTime >= 5000) {
          // Clean up old flag
          sessionStorage.removeItem('topicCreated');
        }
      }
    }
  }, [pathname]);

  // Optional: Refresh list when page becomes visible (with throttling)
  // Commented out to reduce requests - uncomment if needed
  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === 'visible') {
  //       const now = Date.now();
  //       // Throttle: only refresh if last refresh was more than 5 seconds ago
  //       if (now - lastVisibilityChangeRef.current > 5000) {
  //         lastVisibilityChangeRef.current = now;
  //         // Trigger refresh by clearing and resetting search text
  //         setDebouncedSearchText(prev => undefined);
  //         setTimeout(() => setDebouncedSearchText(searchText), 100);
  //       }
  //     }
  //   };

  //   document.addEventListener('visibilitychange', handleVisibilityChange);
    
  //   return () => {
  //     document.removeEventListener('visibilitychange', handleVisibilityChange);
  //   };
  // }, [searchText]);

  return (
    <div className="pb-30 relative max-h-[90vh] overflow-y-auto">
      <SearchInput setValue={setSearchText} />
      <TopicsList key={refreshKey} searchText={debouncedSearchText} />
      <div className="pt-10" />
    </div>
  );
}
