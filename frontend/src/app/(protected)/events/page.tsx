"use client";
import EventsList from "@/components/features/events-list";
import SearchInput from "@/components/features/search-input";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Events() {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);
  const pathname = usePathname();
  const lastRefreshRef = useRef<number>(0);

  // Refresh list when navigating to /events after creating an event
  useEffect(() => {
    if (pathname === '/events') {
      // Check if we just created an event using sessionStorage
      const eventCreated = typeof window !== 'undefined' 
        ? sessionStorage.getItem('eventCreated') 
        : null;
      
      if (eventCreated) {
        const createdTime = parseInt(eventCreated, 10);
        const now = Date.now();
        // Only refresh if event was created recently (within last 5 seconds)
        if (now - createdTime < 5000 && now - lastRefreshRef.current > 1000) {
          lastRefreshRef.current = now;
          // Clear the flag
          sessionStorage.removeItem('eventCreated');
          // Small delay to ensure component is mounted and replication is complete
          const timer = setTimeout(() => {
            setRefreshKey(prev => prev + 1);
          }, 500);
          return () => clearTimeout(timer);
        } else if (now - createdTime >= 5000) {
          // Clean up old flag
          sessionStorage.removeItem('eventCreated');
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
      <EventsList key={refreshKey} searchText={searchText} />
    </div>
  );
}
