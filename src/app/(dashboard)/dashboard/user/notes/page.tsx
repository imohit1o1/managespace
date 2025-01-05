import { Suspense } from "react"; // Import Suspense here
import NotesHomePage from "@/components/notes/notes-homepage";

export default function NotesPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotesHomePage />
    </Suspense>
  );
}
