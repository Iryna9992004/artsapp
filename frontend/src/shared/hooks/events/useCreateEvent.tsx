import { createEvent } from "@/shared/api/services/event.service";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export function useCreateEvent(user_id: string) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function create(title: string, description: string) {
    setIsLoading(true);
    try {
      const response = await createEvent(title, description, user_id);
      if (response) {
        router.back();
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.message);
      }
      toast.error("Error creating event");
    } finally {
      setIsLoading(false);
    }
  }
  return { create, isLoading };
}
