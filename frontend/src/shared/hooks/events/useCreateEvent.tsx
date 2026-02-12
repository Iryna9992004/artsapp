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
      const response = await createEvent(title, description, user_id);
      if (response) {
        toast.success("Event created successfully!");
        // Mark that we just created an event (for refresh trigger)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('eventCreated', Date.now().toString());
        }
        // Add delay to allow replication from PostgreSQL to ClickHouse
        // ClickHouse replication usually takes 1-2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Navigate to events without any query params
        router.replace('/events');
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
