import { z } from "zod";

export const createEventFormvalidationSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(100),
});
