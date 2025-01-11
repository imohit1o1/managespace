import { z } from "zod";

export const labelSchema = z.object({
    name: z.string().min(2, "Label name is required").trim(),
});

export type LabelSchemaType = z.infer<typeof labelSchema> 
