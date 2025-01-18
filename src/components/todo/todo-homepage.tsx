"use client";
import { DatePicker } from "@/components/date-picker";
import { TodoTable } from "@/components/todo/todo-table";
import React from "react";
import { useDateManagement } from "@/hooks/use-date-management"; // Adjust the import path as necessary
import { useTodo } from "@/hooks/use-todo";
import CreateTodo from "@/components/todo/create-todo";

export default function TodoHomePage() {
  const { selectedDate, setSelectedDate } = useDateManagement();
  const {
    isFetchingTodos,
    isFetchingTodosError,
    fetchTodosError,
    fetchedTodos,
  } = useTodo(selectedDate);
  return (
    <main>
      <section className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <DatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </section>
      <TodoTable
        isLoading={isFetchingTodos}
        isError={isFetchingTodosError}
        error={fetchTodosError}
        todoList={fetchedTodos}
      />
      <CreateTodo selectedDate={selectedDate} />
    </main>
  );
}
