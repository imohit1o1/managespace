import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { messages } from "@/lib/messages";
import { remarkSchema } from "@/schema/remarkSchema";

//! PUT - Update Remark
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { user, authenticated, message } = await currentUser();

    if (!authenticated || !user) {
        return NextResponse.json(
            { error: "User not authenticated", message },
            { status: 401 }
        );
    }

    const userId = user.id;
    const { id: remarkId } = await params;

    // Check if remarkId is provided
    if (!remarkId) {
        return NextResponse.json(
            {
                success: false,
                message: messages.error.remarks.id_not_found,
            },
            { status: 400 }
        );
    }
    try {
        // check if the remark id exists in the database or not
        const existingRemarkId = await prisma.remark.findFirst({
            where: { id: remarkId }
        })

        if (!existingRemarkId) {
            return NextResponse.json({
                success: false,
                message: messages.error.remarks.not_found
            }, { status: 400 })
        }

        // check if the existing remark belongs to the authenticated user
        if (existingRemarkId.userId !== userId) {
            return NextResponse.json(
                {
                    error: true,
                    message: messages.error.remarks.not_update_auth_user,
                },
                { status: 403 }
            );
        }

        // Recieve the data from the user
        const body = await req.json();
        // Validate the request body with Zod
        console.log("body: ", { body });

        const parsedData = remarkSchema.safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: messages.warning.remarks.validation,
                    error: parsedData.error.errors.map((err) => ({
                        path: err.path,
                        message: err.message,
                    })),
                },
                { status: 400 }
            );
        }

        const { content } = parsedData.data;

        // Update Remark
        const updatedRemark = await prisma.remark.update({
            where: { id: remarkId },
            data: {
                content,
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                updatedRemark,
            },
            message: messages.success.remarks.update
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: messages.error.remarks.update, error },
            { status: 500 }
        );
    }
}


//! DELETE - Delete Remark
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { user, authenticated, message } = await currentUser();
    if (!authenticated || !user) {
        return NextResponse.json(
            { error: "User not authenticated", message },
            { status: 401 }
        );
    }
    const userId = user.id;
    const { id: remarkId } = await params;

    // Check if folderId is provided
    if (!remarkId) {
        return NextResponse.json(
            {
                error: true,
                message: messages.error.remarks.id_not_found,
            },
            { status: 400 }
        );
    }
    try {
        // check if the remark id exists in the database or not
        const existingRemarkId = await prisma.remark.findFirst({
            where: { id: remarkId }
        })

        if (!existingRemarkId) {
            return NextResponse.json({
                success: false,
                message: messages.error.remarks.not_found
            }, { status: 400 })
        }

        // check if the existing remark belongs to the authenticated user
        if (existingRemarkId.userId !== userId) {
            return NextResponse.json(
                {
                    error: true,
                    message: messages.error.remarks.not_delete_auth_user,
                },
                { status: 403 }
            );
        }

        // Delete the existing label
        const deletedRemark = await prisma.remark.delete({
            where: { id: remarkId }
        });

        return NextResponse.json(
            {
                success: true,
                deletedRemark,
                message: messages.success.remarks.delete,
            },
            { status: 201 }
        );
    } catch (error) {
        console.log("Error creating remark:", error);
        return NextResponse.json(
            { success: false, message: messages.error.remarks.delete, },
            { status: 500 }
        );
    }
}