import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";
import { folderSchema } from "@/schema/folderSchema";
import { prisma } from "@/lib/prisma";
import { messages } from "@/lib/messages";

// PUT - Update Folder
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { user } = await currentUser();
    const userId = user.id;
    const { id: folderId } = await params;

    // Check if folderId is provided
    if (!folderId) {
        return NextResponse.json(
            {
                error: true,
                message: messages.error.folders.id_not_found,
            },
            { status: 400 }
        );
    }

    try {
        // Fetch the folder from the database
        const existingFolder = await prisma.folder.findUnique({
            where: { id: folderId },
        });

        if (!existingFolder) {
            return NextResponse.json(
                {
                    error: true,
                    message: messages.error.folders.not_found,
                },
                { status: 404 }
            );
        }

        if (existingFolder.userId !== userId) {
            return NextResponse.json(
                {
                    error: true,
                    message: messages.error.folders.not_update_auth_user,
                },
                { status: 403 }
            );
        }

        const body = await req.json();
        const parsedData = folderSchema.safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: messages.warning.folders.validation,
                },
                { status: 400 }
            );
        }
        const { name } = parsedData.data;

        // Update the folder
        const updatedFolder = await prisma.folder.update({
            where: { id: folderId },
            data: {
                name,
            },
        });

        // Return the updated folder as the response
        return NextResponse.json(
            {
                success: true,
                updatedFolder,
                message: messages.success.folders.update,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error updating folder:", error);
        return NextResponse.json(
            {
                success: false,
                message: messages.error.folders.update,
            },
            { status: 500 }
        );
    }
}


// DELETE - Delete Folder
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { user } = await currentUser();
    const userId = user.id;
    const { id: folderId } = await params;

    // Check if folderId is provided
    if (!folderId) {
        return NextResponse.json(
            {
                error: true,
                message: messages.error.folders.id_not_found,
            },
            { status: 400 }
        );
    }

    try {
        // Fetch the folder from the database
        const existingFolder = await prisma.folder.findUnique({
            where: { id: folderId },
        });

        if (!existingFolder) {
            return NextResponse.json(
                {
                    success: false,
                    message: messages.error.folders.not_found,
                },
                { status: 404 }
            );
        }

        if (existingFolder.userId !== userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: messages.error.folders.not_delete_auth_user,
                },
                { status: 403 }
            );
        }

        // Delete the folder
        await prisma.folder.delete({
            where: { id: folderId },
        });

        return NextResponse.json(
            {
                success: true,
                message: messages.success.folders.delete,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting folder:", error);
        return NextResponse.json(
            {
                success: false,
                message: messages.error.folders.delete,
            },
            { status: 500 }
        );
    }
}
