import { prisma } from "@/lib/prisma";
import { signInSchema } from "@/schema/authSchema";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/bcrypt-password";
import { User } from "next-auth";

export default {
    providers: [
        Credentials({
            name: "Credentials",
            async authorize(credentials) {
                try {
                    console.log("Credentials :", credentials);

                    // Validate credentials using zod
                    const parsedCredentials = signInSchema.parse(credentials);
                    const { username, password } = parsedCredentials;
                    console.log("Credentials", { username, password });

                    //Check if user exists
                    const existingUser = await prisma.user.findUnique({
                        where: { username }
                    })
                    if (!existingUser) {
                        throw { error: "No user found", status: 401 };
                    }
                    console.log("Existing user", existingUser);

                    // Verify the password
                    if (!existingUser.password) {
                        throw new Error("Invalid user data");
                    }
                    const isPasswordValid = await verifyPassword(password, existingUser.password);

                    if (!isPasswordValid) {
                        throw new Error("Incorrect Password");
                    }

                    const user: User = {
                        id: existingUser.id,
                        name: existingUser.name,
                        username: existingUser.username,
                        email: existingUser.email,
                        image: existingUser.image,
                        role: existingUser.role,
                    };

                    console.log("User", user);

                    // Return the user object
                    return user;
                } catch (error) {
                    console.log(error);
                    throw { error: "Something went wrong", status: 401 };
                }
            },
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            console.log("JWT callback", { token, user });
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.username = user.username;
                token.email = user.email;
                token.image = user.image;
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            console.log("Session callback", { session, token });
            if (session.user && token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.username = token.username;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.role = token.role;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;