"use client";
import { useState } from "react";
import { Todo } from "@prisma/client";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import DialogWrapper from "@/components/dialog-wrapper";
import TodoForm from "./todo-form";
import { useTodo } from "@/hooks/use-todo";
import { TodoSchemaType } from "@/schema/todoSchema";
import { SquarePen } from "lucide-react";

export default function UpdateTodo({ todo }: { todo: Todo }) {
  const [open, setOpen] = useState(false);
  const { isUpdating, updateTodoMutate } = useTodo();

  const onSubmit = async (data: TodoSchemaType) => {
    await updateTodoMutate(
      { todoId: todo.id, updatedTodoData: data },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <DialogWrapper
      trigger={
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <DropdownMenuShortcut className="ml-0">
            <SquarePen className="w-4 h-4" />
          </DropdownMenuShortcut>
          Edit
        </DropdownMenuItem>
      }
      dialogTitle="Update Todo"
      dialogDescription="Edit your todo"
      open={open}
      setOpen={() => setOpen(!open)}
    >
      <TodoForm
        defaultValues={{
          task: todo.task,
          description: todo.description || "",
          status: todo.status,
          priority: todo.priority,
          labels: [],
        }}
        onSubmit={onSubmit}
        submitButtonText="Update"
        isSubmitting={isUpdating}
        isSubmittingText="Updating..."
      />
    </DialogWrapper>
  );
}
