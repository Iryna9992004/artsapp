import { z } from "zod";

export const createPostFormValidationSchema = z.object({
  theme: z.string(),
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(100),
});
