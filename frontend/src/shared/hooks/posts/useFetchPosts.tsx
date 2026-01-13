import { fetchPosts } from "@/shared/api/services/post.service";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Post {
  id: number;
  title: string;
  post_description: string;
  created_at: string;
  author_name: string;
  user_id: number;
}

export function useFetchPosts(
  limit: number,
  offset: number,
  searchText?: string
) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  async function fetch() {
    setIsLoading(true);
    try {
      let response: Post[];
      if (searchText || searchText === "") {
        response = await fetchPosts(offset, limit, searchText);
        setPosts([...response]);
      } else {
        response = await fetchPosts(offset, limit, searchText);
        
        // Reset list when offset is 0, otherwise append
        if (offset === 0) {
          setPosts([...response]);
        } else {
          // Filter out duplicates when appending
          setPosts((prev) => {
            const existingIds = new Set(prev.map(item => item.id));
            const newItems = response.filter(item => !existingIds.has(item.id));
            return [...prev, ...newItems];
          });
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
        toast("Error fetching posts");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetch();
  }, [limit, offset, searchText]);

  return { posts, isLoading, fetch, hasMore };
}

