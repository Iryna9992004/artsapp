import { z } from "zod";

export const searchInputValidationSchema = z.object({
  text: z.string().min(1).max(255),
});
