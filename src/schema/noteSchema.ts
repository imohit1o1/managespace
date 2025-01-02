import { messages } from "@/lib/messages";
import { z } from "zod";

export const noteSchema = z.object({
    title: z.string().optional().default(""),
    description: z.string().optional().default(""),
    isPinned: z.boolean().default(false),
    isFavorite: z.boolean().default(false),
    backgroundColor: z.string().optional().default("bg-muted/30"),
    textColor: z.string().optional().default("text-foreground"),
}).refine((data) => data.title || data.description, {
    message: messages.warning.notes.validation,
    path: ["title"],
});

export type NoteSchemaType = z.infer<typeof noteSchema>;