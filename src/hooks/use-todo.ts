"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { TodoSchemaType } from "@/schema/todoSchema";
import { handleAxiosError } from "@/lib/axios-error-handler";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "./use-toast";

// 1. Fetch todos api call
const fetchTodos = async (date?: string) => {
    try {
        const url = date ? `/api/todos?date=${date}` : `/api/todos`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        return handleAxiosError(error as AxiosError<ApiResponse>, "Error fetching todos");
    }
};

// 2. Create a todo api call
const createTodo = async (selectedDate: string | undefined, todoData: TodoSchemaType) => {
    try {
        const url = selectedDate ? `/api/todos?date=${selectedDate}` : `/api/todos`;
        const response = await axios.post(url, todoData);
        const { success, message, data } = response.data;
        if (success) {
            toast({ title: message });
            return data;
        }
    } catch (error) {
        return handleAxiosError(error as AxiosError<ApiResponse>, "Error creating todos");
    }
};

// 3. Update a todo api call
const updateTodo = async (todoId: string, updatedTodoData: TodoSchemaType) => {
    try {
        const response = await axios.put(`/api/todos/${todoId}`, updatedTodoData);
        const { success, message, data } = response.data;
        if (success) {
            toast({ title: message });
            return data;
        }
    } catch (error) {
        return handleAxiosError(error as AxiosError<ApiResponse>, "Error updating todo");
    }
};

// 4. Delete a todo api call
const deleteTodo = async (todoId: string) => {
    try {
        const response = await axios.delete(`/api/todos/${todoId}`);
        const { success, message } = response.data;
        if (success) {
            toast({ title: message });
        }
    } catch (error) {
        handleAxiosError(error as AxiosError<ApiResponse>, "Error deleting todo");
    }
};

export const useTodo = (date?: string) => {
    const queryClient = useQueryClient();

    // 1. Fetching the todo list based on the selected date
    const {
        isLoading: isFetchingTodos,
        isError: isFetchingTodosError,
        error: fetchTodosError,
        data: fetchedTodos,
    } = useQuery({
        queryKey: ["fetchedTodos", date],
        queryFn: () => fetchTodos(date),
        enabled: date !== undefined, // Fetch only when date is provided
    });

    // 2. Creating a new todo
    const { isPending: isCreating, mutateAsync: createTodoMutate } = useMutation({
        mutationFn: ({ selectedDate, todoData }: { selectedDate?: string; todoData: TodoSchemaType }) => createTodo(selectedDate, todoData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fetchedTodos"] });
        },
    });

    // 3. Update an existing todo
    const { isPending: isUpdating, mutateAsync: updateTodoMutate } = useMutation({
        mutationFn: ({ todoId, updatedTodoData }: { todoId: string; updatedTodoData: TodoSchemaType }) => updateTodo(todoId, updatedTodoData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fetchedTodos"] });
        },
    });

    // 4. Delete an existing todo
    const { isPending: isDeleting, mutateAsync: deleteTodoMutate } = useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fetchedTodos"] });
        },
    });

    return {
        isFetchingTodos,
        isFetchingTodosError,
        fetchTodosError,
        fetchedTodos: fetchedTodos?.data?.todos || [],
        isCreating,
        createTodoMutate,
        isUpdating,
        updateTodoMutate,
        isDeleting,
        deleteTodoMutate,
    };
};
