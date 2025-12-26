import { fetchEvents } from "@/shared/api/services/event.service";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Events {
  id: number;
  title: string;
  event_description: string;
  created_at: string;
  author_name: string;
}

export function useFetchEvents(
  limit: number,
  offset: number,
  searchText?: string
) {
  const [events, setEvents] = useState<Events[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  async function fetch() {
    setIsLoading(true);
    try {
      let response: Events[];
      if (searchText || searchText === "") {
        response = await fetchEvents(offset, limit, searchText);
        setEvents([...response]);
      } else {
        if (limit === 0) {
          response = await fetchEvents(offset, limit);
          setEvents([...response]);
        } else {
          response = await fetchEvents(offset, limit, searchText);
          setEvents((prev) => [...prev, ...response]);
        }
      }

      if (response.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        toast(e.message);
      } else {
        toast("Error fetching events");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetch();
  }, [limit, offset, searchText]);

  return { events, isLoading, fetch, hasMore };
}
