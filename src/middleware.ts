import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/config/auth"; // Assuming you've configured it in auth.config.js

export async function middleware(request: NextRequest) {
    console.log("Middleware triggered!");
    console.log("Request in middleware:", request.method, request.url);
    console.log("process.env.AUTH_SECRET", process.env.AUTH_SECRET);

    const url = request.nextUrl.clone();
    const session = await auth(); // Make sure you're passing the request
    console.log("Session in Middleware:", session);

    if (!session || !session.user) {
        console.log("User not authenticated");
        if (url.pathname.startsWith("/dashboard")) {
            url.pathname = "/sign-in";
            return NextResponse.redirect(url);
        }
    } else {
        console.log("User in Middleware:", session.user);
        const role = session.user.role;

        // Redirect authenticated users to their respective dashboards
        if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
            url.pathname = role === "admin" ? "/dashboard/admin" : "/dashboard/user";
            return NextResponse.redirect(url);
        }

        // Restrict access to dashboards based on roles
        if (url.pathname.startsWith("/dashboard/admin") && role !== "admin") {
            url.pathname = "/dashboard/user";
            return NextResponse.redirect(url);
        }
        if (url.pathname.startsWith("/dashboard/user") && role === "admin") {
            url.pathname = "/dashboard/admin";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/sign-in", "/sign-up", "/dashboard/:path*"],
};
