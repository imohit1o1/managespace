import { hashPassword } from "@/lib/bcrypt-password";
import { messages } from "@/lib/messages";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/schema/authSchema";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate the request data with Zod
        const parsed = signupSchema.safeParse(body);

        if (!parsed.success) {
            return Response.json({
                success: false,
                message: messages.error.signup.user.validation
            }, { status: 400 });
        }

        const { username, email, password } = parsed.data;

        // Check if username or email already exists
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ username }, { email }] },
        });
        if (existingUser) {
            return Response.json({
                success: false,
                message: existingUser.username === username
                    ? messages.warning.username.taken
                    : messages.error.user.email
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

        return Response.json({
            success: true,
            newUser,
            message: messages.success.signup.user.register,
        }, { status: 201 });

    } catch (error) {
        console.log("Error registering user", error);
        return Response.json({
            success: false,
            message: messages.error.signup.user.register
        }, { status: 400 });
    }
}
