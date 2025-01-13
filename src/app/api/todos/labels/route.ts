import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { messages } from "@/lib/messages";
import { labelSchema } from "@/schema/labelSchema";

export async function GET() {
    const { user, authenticated, message } = await currentUser();

    if (!authenticated || !user) {
        return NextResponse.json(
            { error: "User not authenticated", message },
            { status: 401 }
        );
    }

    const userId = user.id;

    try {
        // Fetch all labels created by the user
        const labels = await prisma.label.findMany({
            where: { userId },
            orderBy: [{ updatedAt: "desc" }],
            include: { todos: true }
        });

        if (labels.length === 0) {
            return NextResponse.json(
                { success: true, message: messages.warning.labels.zero },
                { status: 200 }
            );
        }

        // Count total labels
        const totalLabels = await prisma.label.count({
            where: { userId },
        });


        return NextResponse.json({
            success: true,
            data: {
                labels,
                totalLabels
            },
            message: messages.success.labels.fetch
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: messages.error.labels.fetch, error },
            { status: 500 }
        );
    }
}


//! POST - Create a new label
export async function POST(req: NextRequest) {
    const { user, authenticated, message } = await currentUser();
    if (!authenticated || !user) {
        return NextResponse.json(
            { error: "User not authenticated", message },
            { status: 401 }
        );
    }

    try {
        const body = await req.json();

        // Validate the request body with Zod
        const parsedData = labelSchema.safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: messages.warning.labels.validation,
                    error: parsedData.error.errors.map((err) => ({
                        path: err.path,
                        message: err.message,
                    })),
                },
                { status: 400 }
            );
        }

        const { name } = parsedData.data;

        // check if the label name is already exists in the database
        const existingLabel = await prisma.label.findFirst({
            where: { name }
        })
        if (existingLabel) {
            return NextResponse.json({
                success: false,
                message: messages.warning.labels.unique
            }, { status: 400 })
        }

        // Create a new label in the database
        const newLabel = await prisma.label.create({
            data: {
                userId: user.id,
                name
            }
        });

        return NextResponse.json(
            {
                success: true,
                newLabel,
                message: messages.success.labels.create,
            },
            { status: 201 }
        );
    } catch (error) {
        // console.log("Error creating label:", error);
        return NextResponse.json(
            { success: false, message: messages.error.labels.create, error },
            { status: 500 }
        );
    }
}