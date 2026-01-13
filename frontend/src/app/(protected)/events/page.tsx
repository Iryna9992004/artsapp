"use client";
import EventsList from "@/components/features/events-list";
import SearchInput from "@/components/features/search-input";
import React, { useState, useEffect } from "react";

export default function Events() {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh list when page becomes visible or focused
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setRefreshKey(prev => prev + 1);
      }
    };

    const handleFocus = () => {
      setRefreshKey(prev => prev + 1);
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
