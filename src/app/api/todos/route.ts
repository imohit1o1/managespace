import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { messages } from "@/lib/messages";
import { todoSchema } from "@/schema/todoSchema";

type TodoStatus = "in_progress" | "completed" | "pending" | "missed";
type TodoPriority = "low" | "medium" | "high";

interface TodoFilter {
    userId: string;
    date: {
        gte: Date;
        lte: Date;
    };
    status?: TodoStatus;
    priority?: TodoPriority;
}

//! GET - Get all todos on the selected date
export async function GET(req: NextRequest) {
    const { user, authenticated, message } = await currentUser();
    if (!authenticated || !user) {
        return NextResponse.json(
            { error: 'User not authenticated. Please log in to access your todos.', message },
            { status: 401 }
        );
    }

    const userId = user.id;
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date"); // Mandatory parameter

    //! Filtering the todo based on the search parameters
    const statusParam = (searchParams.get("status") as TodoStatus); // Optional parameter with enum type
    const priorityParam = (searchParams.get("priority") as TodoPriority); // Optional parameter with enum type

    // check if the date param is recieved or not
    if (!dateParam) {
        return NextResponse.json(
            { success: false, message: messages.warning.date.param },
            { status: 400 }
        );
    }

    console.log("dateParam: ", dateParam);

    const selectedDate = new Date(dateParam);
    if (isNaN(selectedDate.getTime())) {
        return NextResponse.json(
            { success: false, message: messages.warning.date.invalid },
            { status: 400 }
        );
    }

    const startOfDay = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate(), 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate(), 23, 59, 59, 999));

    // Define the filter parameters
    const filter: TodoFilter = {
        userId,
        date: {
            gte: startOfDay,
            lte: endOfDay,
        },
    };
    if (statusParam) filter.status = statusParam;
    if (priorityParam) filter.priority = priorityParam;

    try {

        // Fetch all todos on the selected date
        const todos = await prisma.todo.findMany({
            where: filter,
            orderBy: [{ createdAt: "desc" }],
            include: { labels: true }
        });

        if (todos.length === 0) {
            let message = "No todos found with the given";

            if (statusParam) message += ` status '${statusParam}'`;
            if (priorityParam) message += ` priority '${priorityParam}'`;
            message += ` for the selected date: ${dateParam}.`;
            return NextResponse.json(
                { success: true, message },
                { status: 200 }
            );
        }

        // Count total todos created by the user
        const totalTodos = await prisma.todo.count({
            where: { userId },
        });

        // Count total todos created by the user on the selected date
        const totalTodosOnSeletedDate = await prisma.todo.count({
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
                todos,
                totalTodosOnSeletedDate,
                totalTodos,
            },
            message: messages.success.todos.fetch
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error creating Todo', error },
            { status: 500 }
        );
    }
}


//! POST - Create a new todo
export async function POST(req: NextRequest) {
    const { user, authenticated, message } = await currentUser();
    if (!authenticated || !user) {
        return NextResponse.json(
            { error: 'User not authenticated', message },
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
    console.log("dateParam: ", dateParam);

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
        const parsedData = todoSchema.safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: messages.warning.todos.validation,
                    error: parsedData.error.errors.map((err) => ({
                        path: err.path,
                        message: err.message,
                    })),
                },
                { status: 400 }
            );
        }

        const { task, description, status, priority, labels } = parsedData.data;

        // Create the Todo in the database
        const newTodo = await prisma.todo.create({
            data: {
                userId: user.id,
                task,
                description,
                status,
                priority,
                labels: {
                    connect: labels.map(label => ({ name: label.name })),
                },
                date: selectedDate,
            },
            include: {
                labels: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                todo: newTodo,
                message: 'Todo created successfully',
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error creating Todo', error },
            { status: 500 }
        );
    }
}
