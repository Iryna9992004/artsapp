import { z } from "zod";

export const createTopicFormvalidationSchema = z.object({
  text: z.string().min(5),
});
