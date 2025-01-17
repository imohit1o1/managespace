import React from "react";
import { DropdownMenuItem, DropdownMenuShortcut } from "../ui/dropdown-menu";
import { Trash2 } from "lucide-react";
import { useTodo } from "@/hooks/use-todo";

export default function DeleteTodo({ todoId }: { todoId: string }) {
  const { deleteTodoMutate } = useTodo();

  const handleDeleteTodo = async () => {
    await deleteTodoMutate(todoId);
  };

  return (
    <DropdownMenuItem onClick={handleDeleteTodo}>
      <DropdownMenuShortcut className="ml-0">
        <Trash2 className="w-4 h-4 text-red-700 hover:text-red-500" />
      </DropdownMenuShortcut>
      Delete
    </DropdownMenuItem>
  );
}
