"use client";
import TopicsList from "@/components/features/topics-list";
import SearchInput from "@/components/features/search-input";
import { useState, useEffect, useRef } from "react";

export const dynamic = "force-dynamic";

export default function Feed() {
  const [searchText, setSearchText] = useState<string | undefined>();
  const [debouncedSearchText, setDebouncedSearchText] = useState<string | undefined>();
  const lastVisibilityChangeRef = useRef<number>(0);

  // Debounce search text to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchText]);

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
      <TopicsList searchText={debouncedSearchText} />
      <div className="pt-10" />
    </div>
  );
}
