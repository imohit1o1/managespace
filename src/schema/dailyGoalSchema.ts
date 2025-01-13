import { messages } from "@/lib/messages";
import { z } from "zod";

export const dailyGoalSchema = z.object({
    targetHours: z
        .number()
        .min(0, messages.warning.dailyGoals.targetHours)
        .max(24, messages.warning.dailyGoals.targetHours),
    targetMinutes: z
        .number()
        .min(0, messages.warning.dailyGoals.targetMinutes)
        .max(60, messages.warning.dailyGoals.targetMinutes),
    actualHours: z
        .number()
        .min(0, messages.warning.dailyGoals.targetHours)
        .max(24, messages.warning.dailyGoals.targetHours),
    actualMinutes: z
        .number()
        .min(0, messages.warning.dailyGoals.targetMinutes)
        .max(60, messages.warning.dailyGoals.targetMinutes),
});


export type RemarkSchemaType = z.infer<typeof dailyGoalSchema> 
