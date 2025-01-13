import { currentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { messages } from "@/lib/messages";
import { todoSchema } from "@/schema/todoSchema";

//! PUT - Update Todo
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { user, authenticated, message } = await currentUser();

    if (!authenticated || !user) {
        return NextResponse.json(
            { error: "User not authenticated", message },
            { status: 401 }
        );
    }

    const userId = user.id;
    const { id: todoId } = await params;

    // Check if todoId is provided
    if (!todoId) {
        return NextResponse.json(
            {
                success: false,
                message: messages.error.todos.id_not_found,
            },
            { status: 400 }
        );
    }
    try {
        // check if the todo id exists in the database or not
        const existingTodoId = await prisma.todo.findFirst({
            where: { id: todoId }
        })

        if (!existingTodoId) {
            return NextResponse.json({
                success: false,
                message: messages.error.todos.not_found
            }, { status: 400 })
        }

        // check if the existing todo belongs to the authenticated user
        if (existingTodoId.userId !== userId) {
            return NextResponse.json(
                {
                    error: true,
                    message: messages.error.todos.not_update_auth_user,
                },
                { status: 403 }
            );
        }

        // Recieve the data from the user
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

        // update todo
        const updatedTodo = await prisma.todo.update({
            where: { id: todoId },
            data: {
                userId: user.id,
                task,
                description,
                status,
                priority,
                labels: {
                    connect: labels.map(label => ({ name: label.name })),
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                updatedTodo,
            },
            message: messages.success.todos.update
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: messages.error.todos.update, error },
            { status: 500 }
        );
    }
}


//! DELETE - Delete label
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { user, authenticated, message } = await currentUser();
    if (!authenticated || !user) {
        return NextResponse.json(
            { error: "User not authenticated", message },
            { status: 401 }
        );
    }
    const userId = user.id;
    const { id: todoId } = await params;

    // Check if todoId is provided
    if (!todoId) {
        return NextResponse.json(
            {
                error: true,
                message: messages.error.todos.id_not_found,
            },
            { status: 400 }
        );
    }

    try {
        // check if the todo id exists in the database or not
        const existingTodoId = await prisma.todo.findFirst({
            where: { id: todoId }
        })

        if (!existingTodoId) {
            return NextResponse.json({
                success: false,
                message: messages.error.todos.not_found
            }, { status: 400 })
        }

        // check if the existing todo belongs to the authenticated user
        if (existingTodoId.userId !== userId) {
            return NextResponse.json(
                {
                    error: true,
                    message: messages.error.todos.not_delete_auth_user,
                },
                { status: 403 }
            );
        }

        // Delete the existing todo
        const deletedTodo = await prisma.todo.delete({
            where: { id: todoId }
        });

        return NextResponse.json(
            {
                success: true,
                deletedTodo,
                message: messages.success.todos.delete,
            },
            { status: 201 }
        );
    } catch (error) {
        console.log("Error creating label:", error);
        return NextResponse.json(
            { success: false, message: messages.error.todos.delete, error },
            { status: 500 }
        );
    }
}