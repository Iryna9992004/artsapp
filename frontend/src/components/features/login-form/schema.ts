import { z } from "zod";

export const loginFormvalidationSchema = z.object({
  email: z.string().min(1).email().max(254),
  password: z.string().min(1).max(50),
});
