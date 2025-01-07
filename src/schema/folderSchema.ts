import { messages } from "@/lib/messages";
import { z } from "zod";

export const folderSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, messages.warning.folders.minlength)
        .max(20, messages.warning.folders.maxLength)
});

export type FolderSchemaType = z.infer<typeof folderSchema> 