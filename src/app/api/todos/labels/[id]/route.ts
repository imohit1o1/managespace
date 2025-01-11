import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { messages } from "@/lib/messages";
import { labelSchema } from "@/schema/labelSchema";

//! PUT - Update label
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { user, authenticated, message } = await currentUser();

    if (!authenticated || !user) {
        return NextResponse.json(
            { error: "User not authenticated", message },
            { status: 401 }
        );
    }

    const userId = user.id;
    const { id: labelId } = await params;

    // Check if folderId is provided
    if (!labelId) {
        return NextResponse.json(
            {
                success: false,
                message: messages.error.labels.id_not_found,
            },
            { status: 400 }
        );
    }
    try {
        // check if the label id exists in the database or not
        const existingLabelId = await prisma.label.findFirst({
            where: { id: labelId }
        })

        if (!existingLabelId) {
            return NextResponse.json({
                success: false,
                message: messages.error.labels.not_found
            }, { status: 400 })
        }

        // check if the existing label belongs to the authenticated user
        if (existingLabelId.userId !== userId) {
            return NextResponse.json(
                {
                    error: true,
                    message: messages.error.labels.not_update_auth_user,
                },
                { status: 403 }
            );
        }

        // Recieve the data from the user
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

        // update label
        const updatedLabel = await prisma.label.update({
            where: { id: labelId },
            data: {
                name,
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                updatedLabel,
            },
            message: messages.success.labels.update
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: messages.error.labels.update, error },
            { status: 500 }
        );
    }
}


//! DELETE - Delete label
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { user, authenticated, message } = await currentUser();
    if (!authenticated || !user) {
        return NextResponse.json(
            { error: "User not authenticated", message },
            { status: 401 }
        );
    }
    const userId = user.id;
    const { id: labelId } = await params;

    // Check if folderId is provided
    if (!labelId) {
        return NextResponse.json(
            {
                error: true,
                message: messages.error.labels.id_not_found,
            },
            { status: 400 }
        );
    }
    try {
        // check if the label id exists in the database or not
        const existingLabel = await prisma.label.findFirst({
            where: { id: labelId }
        })

        if (!existingLabel) {
            return NextResponse.json({
                success: false,
                message: messages.error.labels.not_found
            }, { status: 400 })
        }

        // check if the existing label belongs to the authenticated user
        if (existingLabel.userId !== userId) {
            return NextResponse.json(
                {
                    error: true,
                    message: messages.error.labels.not_delete_auth_user,
                },
                { status: 403 }
            );
        }

        // Delete the existing label
        const deletedLabel = await prisma.label.delete({
            where: { id: labelId }
        });

        return NextResponse.json(
            {
                success: true,
                deletedLabel,
                message: messages.success.labels.delete,
            },
            { status: 201 }
        );
    } catch (error) {
        console.log("Error creating label:", error);
        return NextResponse.json(
            { success: false, message: messages.error.labels.delete, },
            { status: 500 }
        );
    }
}