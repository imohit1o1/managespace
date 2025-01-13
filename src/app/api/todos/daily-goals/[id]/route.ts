import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { messages } from "@/lib/messages";
import { dailyGoalSchema } from "@/schema/dailyGoalSchema";

//! PUT - Update DailyGoal
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { user, authenticated, message } = await currentUser();

    if (!authenticated || !user) {
        return NextResponse.json(
            { error: "User not authenticated", message },
            { status: 401 }
        );
    }

    const userId = user.id;
    const { id: dailyGoalId } = await params;

    // Check if dailyGoalId is provided
    if (!dailyGoalId) {
        return NextResponse.json(
            {
                success: false,
                message: messages.error.dailyGoals.id_not_found,
            },
            { status: 400 }
        );
    }
    try {
        // check if the dailyGoal exists in the database or not
        const existingDailyGoal = await prisma.dailyGoal.findFirst({
            where: { id: dailyGoalId }
        })

        if (!existingDailyGoal) {
            return NextResponse.json({
                success: false,
                message: messages.error.dailyGoals.not_found
            }, { status: 400 })
        }

        // check if the existing todo belongs to the authenticated user
        if (existingDailyGoal.userId !== userId) {
            return NextResponse.json(
                {
                    error: true,
                    message: messages.error.dailyGoals.not_update_auth_user,
                },
                { status: 403 }
            );
        }

        // Recieve the data from the user
        const body = await req.json();
        // Validate the request body with Zod
        const parsedData = dailyGoalSchema.safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: messages.warning.todos.validation,
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

        // update todo
        const updatedDailyGoal = await prisma.dailyGoal.update({
            where: { id: dailyGoalId },
            data: {
                userId: user.id,
                targetMinutes: targetTotalMinutes,
                actualMinutes: actualTotalMinutes,
                progress: progressPercentage,
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                updatedDailyGoal,
            },
            message: messages.success.dailyGoals.update
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: messages.error.dailyGoals.update, error },
            { status: 500 }
        );
    }
}


//! DELETE - Delete DailyGoal
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { user, authenticated, message } = await currentUser();
    if (!authenticated || !user) {
        return NextResponse.json(
            { error: "User not authenticated", message },
            { status: 401 }
        );
    }
    const userId = user.id;
    const { id: dailyGoalId } = await params;

    // Check if dailyGoalId is provided
    if (!dailyGoalId) {
        return NextResponse.json(
            {
                success: false,
                message: messages.error.dailyGoals.id_not_found,
            },
            { status: 400 }
        );
    }

    try {
        // check if the Daily Goal id exists in the database or not
        const existingDailyGoal = await prisma.dailyGoal.findFirst({
            where: { id: dailyGoalId }
        })

        if (!existingDailyGoal) {
            return NextResponse.json({
                success: false,
                message: messages.error.dailyGoals.not_found
            }, { status: 400 })
        }
        // check if the existing Daily Goal belongs to the authenticated user
        if (existingDailyGoal.userId !== userId) {
            return NextResponse.json(
                {
                    error: true,
                    message: messages.error.dailyGoals.not_update_auth_user,
                },
                { status: 403 }
            );
        }

        // Delete the existing Daily Goal
        const deletedDailyGoal = await prisma.dailyGoal.delete({
            where: { id: dailyGoalId }
        });

        return NextResponse.json(
            {
                success: true,
                deletedDailyGoal,
                message: messages.success.dailyGoals.delete,
            },
            { status: 201 }
        );
    } catch (error) {
        console.log("Error creating Daily Goal: ", error);
        return NextResponse.json(
            { success: false, message: messages.error.dailyGoals.delete, error },
            { status: 500 }
        );
    }
}