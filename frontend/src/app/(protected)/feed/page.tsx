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
  const prevPathnameRef = useRef<string | null>(null);
  const lastRefreshRef = useRef<number>(0);

  // Debounce search text to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchText]);

  // Refresh list when navigating to /feed from /feed/create (e.g., after creating a topic)
  useEffect(() => {
    // Check if we're coming from /feed/create to /feed
    if (pathname === '/feed' && prevPathnameRef.current === '/feed/create') {
      const now = Date.now();
      // Throttle: only refresh if last refresh was more than 1 second ago
      if (now - lastRefreshRef.current > 1000) {
        lastRefreshRef.current = now;
        // Small delay to ensure component is mounted and replication is complete
        const timer = setTimeout(() => {
          setRefreshKey(prev => prev + 1);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
    // Update previous pathname
    prevPathnameRef.current = pathname;
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
