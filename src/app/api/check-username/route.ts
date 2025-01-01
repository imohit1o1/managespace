import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { usernameValidation } from "@/schema/authSchema";
import { messages } from "@/lib/messages";

// Zod schema for username validation
const UsernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const queryParam = {
            username: searchParams.get("username"),
        };

        // Validate query parameters with zod
        const result = UsernameQuerySchema.safeParse(queryParam);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return NextResponse.json(
                {
                    success: false,
                    message: usernameErrors.length > 0 ? usernameErrors.join(", ") : messages.error.user.username.invalid_query
                },
                { status: 400 }
            );
        }

        const { username } = result.data;

        // Check if the username exists in the database
        const existingUsername = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUsername) {
            return NextResponse.json(
                {
                    success: false,
                    message: messages.warning.username.taken
                },
                { status: 400 }
            );
        }

        // Returns unique username
        return NextResponse.json(
            {
                success: true,
                message: messages.success.user.username.unique,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error checking username", error);
        return NextResponse.json(
            {
                success: false,
                message: messages.error.user.username.error
            },
            { status: 500 }
        );
    }
}
