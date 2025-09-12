import { z } from "zod";

export const registerFormvalidationSchema = z.object({
  full_name: z.string().min(1).max(255),
  email: z.string().min(1).email().max(254),
  occupation: z.string().min(1).max(50),
  password: z.string().min(1).max(50),
});
