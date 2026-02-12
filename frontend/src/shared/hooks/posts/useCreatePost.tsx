import { createPost } from "@/shared/api/services/post.service";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export function useCreatePost(user_id: number | undefined) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function create(title: string, description: string) {
    if (!user_id) {
      toast.error("User ID is required");
      return;
    }
    setIsLoading(true);
    try {
      const response = await createPost(title, description, user_id);
      if (response) {
        toast.success("Post created successfully!");
        // Mark that we just created a post (for refresh trigger)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('postCreated', Date.now().toString());
        }
        // Add delay to allow replication from PostgreSQL to ClickHouse
        // ClickHouse replication usually takes 1-2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Navigate to posts without any query params
        router.replace("/posts");
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.message);
      } else {
        toast.error("Error creating post");
      }
    } finally {
      setIsLoading(false);
    }
  }
  return { create, isLoading };
}

