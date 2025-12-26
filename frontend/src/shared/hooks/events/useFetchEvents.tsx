import { fetchEvents } from "@/shared/api/services/event.service";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function useFetchEvents(
  limit: number,
  offset: number,
  searchText?: string
) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetch() {
    setIsLoading(true);
    try {
      if (searchText) {
        const response = await fetchEvents(limit, offset, searchText);
        setEvents((prev) => [...prev, ...(response as never)]);
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
    async function fetchEvents() {
      await fetch();
    }
    fetchEvents();
  }, []);
  return { events, isLoading, fetch };
}
