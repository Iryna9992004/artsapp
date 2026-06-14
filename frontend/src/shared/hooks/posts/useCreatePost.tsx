import { createPost } from "@/shared/api/services/post.service";
import { PENDING_KEYS, setPendingItem } from "@/shared/lib/pendingItem";
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
        // Оптимістично зберігаємо створений айтем, щоб показати його у списку
        // одразу, не чекаючи асинхронної реплікації PostgreSQL → ClickHouse.
        const author_name =
          typeof window !== "undefined"
            ? localStorage.getItem("user_name") || ""
            : "";
        setPendingItem(PENDING_KEYS.post, { ...response, author_name });
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

