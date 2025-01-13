import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { messages } from "@/lib/messages";
import { remarkSchema } from "@/schema/remarkSchema";

//! GET : Get all the remarks on the selected date
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
    const dateParam = searchParams.get("date");

    // check if the date param is recieved or not
    if (!dateParam) {
        return NextResponse.json(
            { success: false, message: messages.warning.date.param },
            { status: 400 }
        );
    }
    console.log("Date Param: ", dateParam);


    let startOfDay, endOfDay;
    if (dateParam) {
        const selectedDate = new Date(dateParam);

        // Ensure selectedDate is valid
        if (isNaN(selectedDate.getDate())) {
            return NextResponse.json(
                { success: false, message: messages.warning.date.invalid },
                { status: 400 }
            );
        }

        // Create a new date object in UTC by directly adjusting hours in UTC
        startOfDay = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate(), 0, 0, 0, 0));
        endOfDay = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate(), 23, 59, 59, 999));
    }
    try {
        // Fetch remarks on the selected date
        const remarks = await prisma.remark.findMany({
            where: {
                userId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                }
            },
            orderBy: [{ updatedAt: "desc" }]
        });

        if (remarks.length === 0) {
            return NextResponse.json(
                { success: true, message: messages.warning.remarks.zero },
                { status: 200 }
            );
        }

        // Count total remarks created by the user
        const totalRemarks = await prisma.remark.count({
            where: { userId },
        });

        // Count total remarks created by the user on the selected date
        const totalRemarksOnSeletedDate = await prisma.remark.count({
            where: {
                userId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                }
            },
        });


        return NextResponse.json({
            success: true,
            data: {
                remarks,
                totalRemarksOnSeletedDate,
                totalRemarks,
            },
            message: messages.success.remarks.fetch
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: messages.error.remarks.fetch, error },
            { status: 500 }
        );
    }
}


//! POST - Create Remark
export async function POST(req: NextRequest) {
    const { user, authenticated, message } = await currentUser();
    if (!authenticated || !user) {
        return NextResponse.json(
            { error: "User not authenticated", message },
            { status: 401 }
        );
    }
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");
    // check if the date param is recieved or not
    if (!dateParam) {
        return NextResponse.json(
            { success: false, message: messages.warning.date.param },
            { status: 400 }
        );
    }

    try {
        // Directly parse the date string to a Date object
        const selectedDate = new Date(dateParam);

        if (isNaN(selectedDate.getTime())) {
            return NextResponse.json(
                { success: false, message: messages.warning.date.invalid },
                { status: 400 }
            );
        }

        const body = await req.json();
        // Validate the request body with Zod
        const parsedData = remarkSchema.safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: messages.warning.labels.validation,
                    error: parsedData.error.errors.map((err) => ({
                        path: err.path,
                        message: err.message,
                    })),
                },
                { status: 400 }
            );
        }

        const { content } = parsedData.data;

        // Create a new remark in the database
        const newRemark = await prisma.remark.create({
            data: {
                userId: user.id,
                content,
                date: selectedDate,
            }
        });

        return NextResponse.json(
            {
                success: true,
                newRemark,
                message: messages.success.remarks.create,
            },
            { status: 201 }
        );
    } catch (error) {
        // console.log("Error creating remark:", error);
        return NextResponse.json(
            { success: false, message: messages.error.remarks.create, error },
            { status: 500 }
        );
    }
}