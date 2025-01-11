import { messages } from "@/lib/messages";
import { z } from "zod";

export const remarkSchema = z.object({
    content: z
        .string()
        .min(10, messages.warning.remarks.minlength)
        .max(200, messages.warning.remarks.maxLength)
        .trim(),
});

export type RemarkSchemaType = z.infer<typeof remarkSchema> 
