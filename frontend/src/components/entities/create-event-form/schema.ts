import { z } from "zod";

export const createEventFormvalidationSchema = z.object({
  theme: z.string().min(1).max(50),
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(100),
});
