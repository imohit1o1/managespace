import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assuming you have prisma set up
import { currentUser } from "@/lib/current-user";
import { messages } from "@/lib/messages";
import { dailyGoalSchema } from "@/schema/dailyGoalSchema";

//! Get all DailyGoals on the selected date
export async function GET(req: NextRequest) {
    const { user, authenticated, message } = await currentUser(); // Assuming this is a custom function to get the authenticated user
    if (!authenticated || !user) {
        return NextResponse.json(
            { error: "User not authenticated", message },
            { status: 401 }
        );
    }

    const userId = user.id;
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date"); // Mandatory parameter

    // check if the date param is recieved or not
    if (!dateParam) {
        return NextResponse.json(
            { success: false, message: messages.warning.date.param },
            { status: 400 }
        );
    }

    console.log("dateParam: ", dateParam);

    const selectedDate = new Date(dateParam);
    if (isNaN(selectedDate.getTime())) {
        return NextResponse.json(
            { success: false, message: messages.warning.date.invalid },
            { status: 400 }
        );
    }
    const startOfDay = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate(), 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate(), 23, 59, 59, 999));
    try {
        // Fetch all daily goals for the authenticated user
        const dailyGoals = await prisma.dailyGoal.findMany({
            where: {
                userId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
        });

        if (dailyGoals.length === 0) {
            return NextResponse.json(
                { success: true, message: messages.warning.dailyGoals.zero },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { success: true, data: dailyGoals, message: messages.success.dailyGoals.fetch },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching daily goals:", error);
        return NextResponse.json(
            { success: false, message: messages.error.dailyGoals.fetch, error },
            { status: 500 }
        );
    }
}


//! Create a new DailyGoal once per day on the selected date
export async function POST(req: NextRequest) {
    const { user, authenticated, message } = await currentUser();
    if (!authenticated || !user) {
        return NextResponse.json(
            { error: "User not authenticated", message },
            { status: 401 }
        );
    };
    const userId = user.id;
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");
    // check if the date param is recieved or not
    if (!dateParam) {
        return NextResponse.json(
            { success: false, message: messages.warning.date.param },
            { status: 400 }
        );
    }
    console.log("userId: ", userId);
    console.log("dateParam: ", dateParam);

    try {
        // Directly parse the date string to a Date object
        const selectedDate = new Date(dateParam);

        if (isNaN(selectedDate.getTime())) {
            return NextResponse.json(
                { success: false, message: messages.warning.date.invalid },
                { status: 400 }
            );
        }

        const body = await req.json();
        // Validate the request body with Zod
        const parsedData = dailyGoalSchema.safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: messages.warning.dialyGoal.validation,
                    error: parsedData.error.errors.map((err) => ({
                        path: err.path,
                        message: err.message,
                    })),
                },
                { status: 400 }
            );
        }

        const { targetHours, targetMinutes, actualHours, actualMinutes } = parsedData.data;
        // Convert hours and minutes into total minutes
        const targetTotalMinutes = targetHours * 60 + targetMinutes;
        const actualTotalMinutes = actualHours * 60 + actualMinutes;
        const progressPercentage = parseFloat(((actualTotalMinutes / targetTotalMinutes) * 100).toFixed(2));

        // Create the new daily goal
        const newGoal = await prisma.dailyGoal.create({
            data: {
                userId,
                targetMinutes: targetTotalMinutes,
                actualMinutes: actualTotalMinutes,
                progress: progressPercentage,
                date: selectedDate,
            },
        });

        return NextResponse.json(
            { success: true, data: newGoal, message: messages.success.dailyGoals.create },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating daily goal:", error);
        return NextResponse.json(
            { success: false, message: messages.error.dailyGoals.create, error },
            { status: 500 }
        );
    }
}