import { hashPassword } from "@/lib/bcrypt-password";
import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/schema/authSchema";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("POST", body);

        // Validate the request data with Zod
        const parsed = signUpSchema.safeParse(body);
        if (!parsed.success) {
            return Response.json({
                success: false,
                message: "Validation failed",
                errors: parsed.error.errors,
            }, { status: 400 });
        }

        const { username, email, password } = parsed.data;
        console.log("Parsed data", parsed.data);
        // Check if username or email already exists
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ username }, { email }] },
        });
        if (existingUser) {
            return Response.json({
                success: false,
                message: existingUser.username === username
                    ? "Username is already taken"
                    : "Email address already exists",
            }, { status: 400 });
        }

        // Hash the password and create the user
        const hashedPassword = await hashPassword(password);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        console.log("New user", newUser);
        return Response.json({
            success: true,
            data: newUser,
            message: "User registered successfully",
        }, { status: 201 });

    } catch (error) {
        console.error("Error registering user", error);
        return Response.json({
            success: false,
            message: "Error registering user"
        }, { status: 400 });
    }
}
