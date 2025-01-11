import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { noteSchema } from "@/schema/noteSchema";
import { NextRequest, NextResponse } from "next/server";
import { messages } from "@/lib/messages";
interface NotesFilter {
    userId: string;
    isPinned?: boolean;
    isFavorite?: boolean;
}

// GET Handler: Fetch notes based on filters
export async function GET(req: NextRequest) {
    const { user, authenticated, message } = await currentUser();

    if (!authenticated || !user) {
        return NextResponse.json(
            { error: "User not authenticated", message },
            { status: 401 }
        );
    }

    const userId = user.id;
    const { searchParams } = new URL(req.url);
    const queryTab = searchParams.get("tab") || "all";

    // Set filters based on the tab
    const filter: NotesFilter = { userId };
    if (queryTab === "pinned") {
        filter.isPinned = true;
    } else if (queryTab === "favorites") {
        filter.isFavorite = true;
    }

    try {
        // Fetch filtered notes
        const notes = await prisma.notes.findMany({
            where: filter,
            orderBy: [
                { isPinned: "desc" },
                { createdAt: "desc" },
            ],
        });

        // Count total, pinned, and favorite notes
        const totalNotes = await prisma.notes.count({
            where: { userId },
        });

        const totalPinnedNotes = await prisma.notes.count({
            where: { userId, isPinned: true },
        });

        const totalFavoriteNotes = await prisma.notes.count({
            where: { userId, isFavorite: true },
        });

        return NextResponse.json({
            success: true,
            notes,
            totalNotes,
            totalPinnedNotes,
            totalFavoriteNotes,
            message: messages.success.notes.fetch
        }, { status: 200 });
    } catch (error) {
        // console.log("Error fetching notes:", error); // it throws a null value
        return NextResponse.json(
            { success: false, message: messages.error.notes.fetch },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const { user, authenticated, message } = await currentUser();

    // Check if the user is authenticated
    if (!authenticated || !user) {
        return NextResponse.json(
            { error: "User not authenticated", message },
            { status: 401 }
        );
    }

    try {
        const body = await req.json();
        // Validate the parsed data
        const parsedData = noteSchema.safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json(
                {
                    error: true,
                    message: messages.warning.notes.validation,
                },
                { status: 400 }
            );
        }

        const { title, description, isPinned, isFavorite, backgroundColor, textColor } = parsedData.data;

        // Create a new note in the database
        const newNote = await prisma.notes.create({
            data: {
                userId: user.id,
                title,
                description,
                isPinned,
                isFavorite,
                backgroundColor,
                textColor,
            },
        });

        // Respond with the newly created note
        return NextResponse.json(
            {
                success: true,
                newNote,
                message: messages.success.notes.create
            },
            { status: 201 }
        );
    } catch (error) {
        console.log("Error creating note:", error);
        return NextResponse.json(
            { success: false, message: messages.error.notes.create },
            { status: 500 }
        );
    }
}

