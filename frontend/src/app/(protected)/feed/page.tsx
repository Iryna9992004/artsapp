"use client";
import TopicsList from "@/components/features/topics-list";
import SearchInput from "@/components/features/search-input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Feed() {
  const [searchText, setSearchText] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

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
    <div className="pb-30 relative max-h-[90vh] overflow-y-auto">
      <SearchInput setValue={setSearchText} />
      <TopicsList key={refreshKey} searchText={searchText} />
      <div className="pt-10" />
    </div>
  );
}
