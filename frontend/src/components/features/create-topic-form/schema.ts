import { z } from "zod";

export const createTopicFormvalidationSchema = z.object({
  topic: z
    .string()
    .min(5, "Topic is required")
    .min(10, "Topic must be at least 10 characters"),
});
