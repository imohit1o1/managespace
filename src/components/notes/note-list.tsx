import React from "react";
import NoteCard from "@/components/notes/note-card";
import Note from "@/types/interfaces";
import { Loader2 } from "lucide-react";

interface NoteListProps {
  notes: Note[];
  isLoading: boolean;
  // error: boolean;
}

export default function NoteList({ notes, isLoading }: NoteListProps) {
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading notes...</span>
      </div>
    );
  }

  // Render error state
  // if (error) {
  //   return (
  //     <div className="py-4 text-center">
  //       <p className="text-red-500">There was an error fetching notes.</p>
  //     </div>
  //   );
  // }

  // Render no notes state
  if (notes.length === 0) {
    return (
      <div className="py-4 text-center">
        <p>No notes available. Try creating some!</p>
      </div>
    );
  }

  // Render notes list
  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 overflow-hidden">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </section>
  );
}
