import { createEvent } from "@/shared/api/services/event.service";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export function useCreateEvent(user_id: number | undefined) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function create(title: string, description: string) {
    if (!user_id) {
      toast.error("User ID is required");
      return;
    }
    setIsLoading(true);
    try {
      const response = await createEvent(title, description, String(user_id));
      if (response) {
        toast.success("Event created successfully!");
        router.push('/events');
        router.refresh();
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.message);
      } else {
        toast.error("Error creating event");
      }
    } finally {
      setIsLoading(false);
    }
  }
  return { create, isLoading };
}
