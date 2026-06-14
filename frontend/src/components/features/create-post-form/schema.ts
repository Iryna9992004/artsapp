import { z } from "zod";

export const createPostFormValidationSchema = z.object({
  theme: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
});
