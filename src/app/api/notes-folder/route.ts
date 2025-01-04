import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";
import { folderSchema } from "@/schema/folderSchema";
import { prisma } from "@/lib/prisma";
import { messages } from "@/lib/messages";

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
        // Fetch folders based on the userId
        const folders = await prisma.folder.findMany({
            where: { userId },
            orderBy: [{ createdAt: "desc" }],
            include: {
                // Include subfolders and notes for each folder
                subfolders: true,
                notes: true,
            },
        });

        // Count total folders
        const totalFolders = await prisma.folder.count({
            where: { userId },
        });

        return NextResponse.json({
            success: true,
            folders,
            totalFolders,
            message: messages.success.folders.fetch,
        }, { status: 200 });
    } catch (error) {
        console.log("Error fetching folders:", error);
        return NextResponse.json(
            { success: false, message: messages.error.folders.fetch },
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
        const parsedData = folderSchema.safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json(
                {
                    error: true,
                    message: messages.warning.folders.validation,
                },
                { status: 400 }
            );
        }

        const { name } = parsedData.data;

        // Check if a folder with the same name already exists for the user
        const existingFolder = await prisma.folder.findFirst({
            where: {
                name,
                userId: user.id,
            },
        });


        if (existingFolder) {
            return NextResponse.json(
                {
                    error: true,
                    message: messages.error.folders.name_taken,
                },
                { status: 400 }
            );
        }

        // Create a new folder in the database
        const newFolder = await prisma.folder.create({
            data: {
                userId: user.id,
                name,
            },
        });

        // Respond with the newly created folder
        return NextResponse.json(
            {
                success: true,
                newFolder,
                message: messages.success.folders.create
            },
            { status: 201 }
        );
    } catch (error) {
        console.log("Error creating folder:", error);
        return NextResponse.json(
            { success: false, message: messages.error.folders.create },
            { status: 500 }
        );
    }
}
