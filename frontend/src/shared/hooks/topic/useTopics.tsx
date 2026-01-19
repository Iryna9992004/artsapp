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
      let response: Topic[];
      
      if (searchText && searchText?.length > 0) {
        response = await fetchTopics(limit, offset, searchText);
        setTopics([...response]);
      } else if (searchText === "") {
        response = await fetchTopics(limit, offset, searchText);
        setTopics([...response]);
      } else {
        response = await fetchTopics(limit, offset);
        
        // Reset list when offset is 0, otherwise append
        if (offset === 0) {
          setTopics([...response]);
        } else {
          // Filter out duplicates when appending
          setTopics((prev) => {
            const existingIds = new Set(prev.map(item => item.id));
            const newItems = response.filter(item => !existingIds.has(item.id));
            return [...prev, ...newItems];
          });
        }
      }

      // Check if there are more items
      if (response.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.message);
      } else {
        toast.error("Failed to fetch topics");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetch();
  }, [offset, limit, searchText]);

  return { isLoading, fetch, topics, hasMore };
}
