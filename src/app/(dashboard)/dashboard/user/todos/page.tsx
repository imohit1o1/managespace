import { Suspense } from "react"; // Import Suspense here
import TodoHomePage from "@/components/todo/todo-homepage";

export default function TodoPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TodoHomePage />
    </Suspense>
  );
}
