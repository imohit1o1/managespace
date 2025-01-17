"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import DialogWrapper from "@/components/dialog-wrapper";
import TodoForm from "./todo-form";
import { type TodoSchemaType } from "@/schema/todoSchema";
import { useTodo } from "@/hooks/use-todo";

interface CreateTodoProps {
  selectedDate: string;
}

export default function CreateTodo({ selectedDate }: CreateTodoProps) {
  const [open, setOpen] = useState(false);
  const { isCreating, createTodoMutate } = useTodo(selectedDate);

  const onSubmit = (todoData: TodoSchemaType) => {
    console.log("submit");
    createTodoMutate(
      { selectedDate, todoData },
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
        <Button
          aria-label="Create a new task"
          variant="floating"
          size="floating"
          className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 z-90"
        >
          <Plus />
        </Button>
      }
      dialogTitle="Create Task"
      dialogDescription="Fill in the details below to create a new task."
      open={open}
      setOpen={() => setOpen(!open)}
    >
      <TodoForm
        defaultValues={{
          task: "",
          description: "",
          status: "in_progress",
          priority: "low",
          labels: [],
        }}
        onSubmit={onSubmit}
        submitButtonText="Create"
        isSubmitting={isCreating}
        isSubmittingText="Creating"
      />
    </DialogWrapper>
  );
}
