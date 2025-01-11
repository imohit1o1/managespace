// import { currentUser } from "@/lib/current-user";
// import { prisma } from "@/lib/prisma";
// import { NextRequest, NextResponse } from "next/server";
// import { messages } from "@/lib/messages";
// import { todoSchema } from "@/schema/todoSchema";

// export async function GET(req: NextRequest) {
//     const { user, authenticated, message } = await currentUser();

//     if (!authenticated || !user) {
//         return NextResponse.json(
//             { error: "User not authenticated", message },
//             { status: 401 }
//         );
//     }

//     const userId = user.id;
//     const { searchParams } = new URL(req.url);
//     const dateParam = searchParams.get("date");

//     console.log("Date Param: ", dateParam);

//     let startOfDay, endOfDay;
//     if (dateParam) {
//         const selectedDate = new Date(dateParam);

//         // Ensure selectedDate is valid
//         if (isNaN(selectedDate.getDate())) {
//             return NextResponse.json(
//                 { success: false, message: "Invalid date format." },
//                 { status: 400 }
//             );
//         }
//         console.log("Selected Date: ", selectedDate);

//         // Create a new date object in UTC by directly adjusting hours in UTC
//         startOfDay = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate(), 0, 0, 0, 0));
//         endOfDay = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate(), 23, 59, 59, 999));

//         console.log("Start of Day (UTC):", startOfDay);
//         console.log("End of Day (UTC):", endOfDay);
//     }


//     try {
//         // Fetch todos on the selected date
//         const todos = await prisma.todo.findMany({
//             where: {
//                 userId,
//                 createdAt: {
//                     gte: startOfDay,
//                     lte: endOfDay,
//                 }
//             },
//             include: {
//                 labels: true,
//             },
//         });

//         if (todos.length === 0) {
//             return NextResponse.json(
//                 { success: true, message: messages.warning.todos.zero },
//                 { status: 200 }
//             );
//         }

//         // Count total, pinned, and favorite notes
//         const totalTodos = await prisma.todo.count({
//             where: {
//                 userId,
//                 createdAt: {
//                     gte: startOfDay,
//                     lte: endOfDay
//                 }
//             },
//         });

//         const totalInProgressTodos = await prisma.todo.count({
//             where: {
//                 userId,
//                 status: "in_progress",
//                 createdAt: {
//                     gte: startOfDay,
//                     lte: endOfDay,
//                 },
//             },
//         });

//         const totalCompletedTodos = await prisma.todo.count({
//             where: {
//                 userId,
//                 status: "completed",
//                 createdAt: {
//                     gte: startOfDay,
//                     lte: endOfDay,
//                 },
//             },
//         });
//         const totalMissedTodos = await prisma.todo.count({
//             where: {
//                 userId,
//                 status: "missed",
//                 createdAt: {
//                     gte: startOfDay,
//                     lte: endOfDay
//                 }
//             },
//         });

//         return NextResponse.json({
//             success: true,
//             data: {
//                 todos,
//                 totalTodos,
//                 totalInProgressTodos,
//                 totalCompletedTodos,
//                 totalMissedTodos,
//             },
//             message: messages.success.todos.fetch
//         }, { status: 200 });
//     } catch (error) {
//         console.log("Error fetching todos:", error); // it throws a null value
//         return NextResponse.json(
//             { success: false, message: messages.error.todos.fetch, },
//             { status: 500 }
//         );
//     }
// }

// export async function POST(req: NextRequest) {
//     const { user, authenticated, message } = await currentUser();

//     // Check if the user is authenticated
//     if (!authenticated || !user) {
//         return NextResponse.json(
//             { error: "User not authenticated", message },
//             { status: 401 }
//         );
//     }

//     try {
//         const body = await req.json();
//         // Validate the parsed data
//         const parsedData = todoSchema.safeParse(body);
//         if (!parsedData.success) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: messages.warning.todos.validation,
//                     error: parsedData.error.errors.map((err) => ({
//                         path: err.path,
//                         message: err.message,
//                     })),
//                 },
//                 { status: 400 }
//             );
//         }

//         const { todo, description, status, priority, labels } = parsedData.data;

//         // Parse and handle date fields
//         // const formattedDueDate = dueDate ? new Date(dueDate) : null;
//         // const formattedCompletedAt = completedAt ? new Date(completedAt) : null;
//         console.log("Parsed data: ", parsedData);

//         // Create a new note in the database
//         const newTodo = await prisma.todo.create({
//             data: {
//                 userId: user.id,
//                 todo,
//                 description,
//                 status,
//                 priority,
//                 labels: {
//                     create: labels.map((label) => ({ name: label.name })),
//                 },
//                 // dueDate: formattedDueDate,
//                 // completedAt: formattedCompletedAt,
//             },
//             include: {
//                 labels: true,
//             },
//         });

//         // Respond with the newly created note
//         return NextResponse.json(
//             {
//                 success: true,
//                 newTodo,
//                 message: messages.success.todos.create
//             },
//             { status: 201 }
//         );
//     } catch (error) {
//         // console.log("Error creating todo:", error);
//         return NextResponse.json(
//             { success: false, message: messages.error.todos.create },
//             { status: 500 }
//         );
//     }
// }