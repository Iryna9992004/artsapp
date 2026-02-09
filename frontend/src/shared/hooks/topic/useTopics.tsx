import { fetchTopics } from "@/shared/api/services/topic.service";
import { AxiosError } from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";

interface Topic {
  id: number;
  text: string;
  author_name: string;
  created_at: string;
}

export function useTopics(
  offset: number,
  limit: number = 10,
  searchText?: string
) {
  const [isLoading, setIsLoading] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRequestRef = useRef<{ offset: number; limit: number; searchText?: string } | null>(null);

  useEffect(() => {
    // Skip if same request is already in progress
    const requestKey = `${offset}-${limit}-${searchText || ''}-${refreshTrigger}`;
    const lastKey = lastRequestRef.current 
      ? `${lastRequestRef.current.offset}-${lastRequestRef.current.limit}-${lastRequestRef.current.searchText || ''}`
      : null;
    
    // Only skip if it's the exact same request (including refreshTrigger)
    if (requestKey === lastKey && refreshTrigger === 0) {
      return;
    }

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    lastRequestRef.current = { offset, limit, searchText };

    let isCancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        let response: Topic[];
        
        if (searchText && searchText?.length > 0) {
          response = await fetchTopics(offset, limit, searchText);
          console.log('Fetched topics (search):', response);
          // Reset list when searching
          if (!isCancelled) {
            // Ensure response is an array
            const topicsArray = Array.isArray(response) ? response : [];
            setTopics([...topicsArray]);
          }
        } else if (searchText === "") {
          response = await fetchTopics(offset, limit, searchText);
          console.log('Fetched topics (empty search):', response);
          // Reset list when clearing search
          if (!isCancelled) {
            const topicsArray = Array.isArray(response) ? response : [];
            setTopics([...topicsArray]);
          }
        } else {
          response = await fetchTopics(offset, limit);
          console.log('Fetched topics (no search):', response, 'offset:', offset, 'limit:', limit);
          
          if (!isCancelled) {
            // Ensure response is an array
            const topicsArray = Array.isArray(response) ? response : [];
            // Reset list when offset is 0, otherwise append
            if (offset === 0) {
              setTopics([...topicsArray]);
            } else {
              // Filter out duplicates when appending
              setTopics((prev) => {
                const existingIds = new Set(prev.map(item => item.id));
                const newItems = topicsArray.filter(item => !existingIds.has(item.id));
                return [...prev, ...newItems];
              });
            }
          }
        }

        if (!isCancelled) {
          // Check if there are more items
          const topicsArray = Array.isArray(response) ? response : [];
          if (topicsArray.length < limit) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        }
      } catch (e) {
        // Ignore abort errors
        if (e instanceof Error && e.name === 'AbortError') {
          return;
        }
        
        if (!isCancelled) {
          if (e instanceof AxiosError) {
            // Don't show error toast for cancelled requests
            if (e.code !== 'ERR_CANCELED') {
              toast.error(e.response?.data?.message || "Failed to fetch topics");
            }
          } else {
            toast.error("Failed to fetch topics");
          }
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    
    // Cleanup: abort request on unmount or when dependencies change
    return () => {
      isCancelled = true;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [offset, limit, searchText, refreshTrigger]);

  // Manual fetch function for external use (triggers re-fetch with current params)
  const fetch = useCallback(async () => {
    // Force re-fetch by incrementing refreshTrigger
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return { isLoading, fetch, topics, hasMore };
}
