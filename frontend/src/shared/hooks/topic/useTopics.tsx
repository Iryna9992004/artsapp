import { fetchTopics } from "@/shared/api/services/topic.service";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
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

  async function fetch() {
    setIsLoading(true);
    try {
      if (searchText && searchText?.length > 0) {
        const response = await fetchTopics(limit, offset, searchText);
        if (response.length === 10) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
        setTopics([...response]);
      } else if (searchText === "") {
        const response = await fetchTopics(limit, offset, searchText);
        if (response.length === 10) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
        setTopics([...response]);
      } else {
        const response = await fetchTopics(limit, offset);
        if (response.length === 10) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }

        if (offset === 0) {
          setTopics([...response]);
        } else {
          setTopics((prev) => [...prev, ...response]);
        }
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.message);
      }
      toast.error("Failed to fetch topics");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetch();
  }, [offset, limit, searchText]);

  return { isLoading, fetch, topics, hasMore };
}
