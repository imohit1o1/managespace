import { z } from "zod";

export const todoSchema = z.object({
    task: z
        .string()
        .min(1, "Task cannot be empty")
        .trim(),
    description: z
        .string()
        .trim()
        .optional()
        .default(""),
    status: z
        .enum(["in_progress", "pending", "completed", "missed"])
        .default("in_progress"),
    priority: z
        .enum(["low", "medium", "high"])
        .default("low"),
    labels: z
        .array(z.object({ name: z.string() }))
        .optional()
        .default([]),
    // dueDate: z
    //     .union([z.string(), z.date()])
    //     .optional()
    //     .transform((value) => (typeof value === "string" ? new Date(value) : value)),
    // completedAt: z
    //     .union([z.string(), z.date()])
    //     .optional()
    //     .transform((value) => (typeof value === "string" ? new Date(value) : value)),
})

export type TodoSchemaType = z.infer<typeof todoSchema>;