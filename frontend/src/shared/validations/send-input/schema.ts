import { z } from "zod";

export const sendFormValidationSchema = z.object({
  text: z.string().min(1).max(254),
});
