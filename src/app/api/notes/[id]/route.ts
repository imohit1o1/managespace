import { currentUser } from "@/lib/current-user";
import { messages } from "@/lib/messages";
import { prisma } from "@/lib/prisma";
import { noteSchema } from "@/schema/noteSchema";
import { NextRequest, NextResponse } from "next/server";

// PUT - Update Note
export async function PUT(req: NextRequest, { params }: {
    params: Promise<{ id: string }>
}) {
    const { user } = await currentUser();
    const userId = user.id;
    const { id: noteId } = await params;

    // Check if noteId is provided
    if (!noteId) {
        return NextResponse.json(
            {
                error: true,
                message: messages.error.notes.id_not_found
            },
            { status: 400 }
        );
    }

    try {
        // Fetch the note from the database
        const existingNote = await prisma.notes.findUnique({
            where: { id: noteId },
        });

        if (!existingNote) {
            return NextResponse.json(
                {
                    error: true,
                    message: messages.error.notes.not_found,
                },
                { status: 404 }
            );
        }

        if (existingNote.userId !== userId) {
            return NextResponse.json(
                {
                    error: true,
                    message: messages.error.notes.not_update_auth_user
                },
                { status: 403 });
        }

        const body = await req.json();
        const parsedData = noteSchema.safeParse(body);

        if (!parsedData.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: messages.warning.notes.validation,
                },
                { status: 400 }
            );
        }

        const { title, description, isPinned, isFavorite, backgroundColor, textColor } = parsedData.data;

        // Update the note
        const updatedNote = await prisma.notes.update({
            where: { id: noteId },
            data: {
                title,
                description,
                isPinned,
                isFavorite,
                backgroundColor,
                textColor,
            },
        });

        // Return the updated note as the response
        return NextResponse.json(
            {
                success: true,
                updatedNote,
                message: messages.success.notes.update
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error updating note:", error);
        return NextResponse.json(
            {
                success: false,
                messages: messages.error.notes.update
            }, { status: 500 }
        );
    }
}

// DELETE - Delete Note
export async function DELETE(req: NextRequest, { params }: {
    params: Promise<{ id: string }>
}) {
    const { user } = await currentUser();
    const userId = user.id;
    const { id: noteId } = await params;

    // Check if noteId is provided
    if (!noteId) {
        return NextResponse.json(
            {
                error: true,
                message: messages.error.notes.id_not_found
            },
            { status: 400 }
        );
    }

    try {

        const existingNote = await prisma.notes.findUnique({
            where: { id: noteId },
        });

        if (!existingNote) {
            return NextResponse.json(
                {
                    success: false
                    , message: messages.error.notes.not_found,
                },
                { status: 404 }
            );
        }

        if (existingNote.userId !== userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: messages.error.notes.not_delete_auth_user
                },
                { status: 403 });
        }

        // Delete the note
        await prisma.notes.delete({
            where: { id: noteId },
        });

        return NextResponse.json(
            {
                success: true,
                message: messages.success.notes.delete
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting note:", error);
        return NextResponse.json(
            {
                success: false,
                message: messages.error.notes.delete
            },
            { status: 500 }
        );
    }
}
