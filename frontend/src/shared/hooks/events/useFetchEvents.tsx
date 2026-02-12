import { fetchEvents } from "@/shared/api/services/event.service";
import { AxiosError } from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";

interface Events {
  id: number;
  title: string;
  event_description: string;
  created_at: string;
  author_name: string;
}

export function useFetchEvents(
  offset: number,
  limit: number = 10,
  searchText?: string
) {
  const [events, setEvents] = useState<Events[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRequestRef = useRef<{ offset: number; limit: number; searchText?: string } | null>(null);
  const isCancelledRef = useRef(false);

  useEffect(() => {
    // Reset cancelled flag for new request
    isCancelledRef.current = false;
    
    // If refreshTrigger changed, reset lastRequestRef to force fetch
    if (refreshTrigger > 0) {
      lastRequestRef.current = null;
    }
    
    // Always fetch when refreshTrigger changes (component remounted or forced refresh)
    // Skip only if it's the exact same request AND refreshTrigger is 0 AND lastRequestRef exists
    const requestKey = `${offset}-${limit}-${searchText || ''}`;
    const lastKey = lastRequestRef.current 
      ? `${lastRequestRef.current.offset}-${lastRequestRef.current.limit}-${lastRequestRef.current.searchText || ''}`
      : null;
    
    // Skip only if it's the exact same request AND refreshTrigger is 0 AND we have a previous request
    // When refreshTrigger > 0, always fetch (force refresh)
    // When component remounts (key changes), lastRequestRef is null, so it will fetch
    if (requestKey === lastKey && refreshTrigger === 0 && lastRequestRef.current !== null) {
      console.log('Skipping fetch - same request:', requestKey);
      return;
    }
    
    console.log('Fetching events - offset:', offset, 'limit:', limit, 'searchText:', searchText, 'refreshTrigger:', refreshTrigger);

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    lastRequestRef.current = { offset, limit, searchText };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        let response: Events[];
        
        if (searchText && searchText?.length > 0) {
          response = await fetchEvents(offset, limit, searchText);
          console.log('Fetched events (search):', response, 'offset:', offset, 'limit:', limit);
          // Reset list when searching
          if (!isCancelledRef.current) {
            const eventsArray = Array.isArray(response) ? response : [];
            setEvents([...eventsArray]);
            // Check if there are more items
            if (eventsArray.length < limit) {
              setHasMore(false);
            } else {
              setHasMore(true);
            }
          }
        } else if (searchText === "") {
          response = await fetchEvents(offset, limit, searchText);
          console.log('Fetched events (empty search):', response, 'offset:', offset, 'limit:', limit);
          // Reset list when clearing search
          if (!isCancelledRef.current) {
            const eventsArray = Array.isArray(response) ? response : [];
            setEvents([...eventsArray]);
            // Check if there are more items
            if (eventsArray.length < limit) {
              setHasMore(false);
            } else {
              setHasMore(true);
            }
          }
        } else {
          response = await fetchEvents(offset, limit);
          console.log('Fetched events (no search):', response, 'offset:', offset, 'limit:', limit);
          
          if (!isCancelledRef.current) {
            const eventsArray = Array.isArray(response) ? response : [];
            console.log('Setting events, isCancelled:', isCancelledRef.current, 'eventsArray length:', eventsArray.length);
            // Reset list when offset is 0, otherwise append
            if (offset === 0) {
              setEvents([...eventsArray]);
            } else {
              // Filter out duplicates when appending
              setEvents((prev) => {
                const existingIds = new Set(prev.map(item => item.id));
                const newItems = eventsArray.filter(item => !existingIds.has(item.id));
                return [...prev, ...newItems];
              });
            }
            // Check if there are more items
            if (eventsArray.length < limit) {
              setHasMore(false);
            } else {
              setHasMore(true);
            }
          } else {
            console.log('Request was cancelled, not setting events');
          }
        }
      } catch (e) {
        console.error('Error fetching events:', e);
        // Ignore abort errors
        if (e instanceof Error && e.name === 'AbortError') {
          console.log('Request aborted');
          return;
        }
        
        if (!isCancelledRef.current) {
          if (e instanceof AxiosError) {
            // Don't show error toast for cancelled requests
            if (e.code !== 'ERR_CANCELED') {
              console.error('Axios error:', e.response?.data || e.message);
              toast.error(e.response?.data?.message || "Failed to fetch events");
            }
          } else {
            console.error('Unknown error:', e);
            toast.error("Failed to fetch events");
          }
          // Always set loading to false on error
          setIsLoading(false);
        }
      } finally {
        // Always set loading to false, even if cancelled
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Cleanup: abort request on unmount or when dependencies change
    return () => {
      isCancelledRef.current = true;
      // Only abort if this is still the current request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Reset loading state if component unmounts
      setIsLoading(false);
    };
  }, [offset, limit, searchText, refreshTrigger]);

  // Manual fetch function for external use (triggers re-fetch with current params)
  const fetch = useCallback(async () => {
    // Force re-fetch by incrementing refreshTrigger
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return { events, isLoading, fetch, hasMore };
}
