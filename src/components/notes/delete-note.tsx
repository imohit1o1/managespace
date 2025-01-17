import React from "react";
import { DropdownMenuItem, DropdownMenuShortcut } from "../ui/dropdown-menu";
import { Trash2 } from "lucide-react";
import { useNotes } from "@/hooks/use-notes";

export default function DeleteNote({ noteId }: { noteId: string }) {
  const { deleteNoteMutate } = useNotes();

  const handleDeleteNote = async () => {
    await deleteNoteMutate(noteId);
  };

  return (
    <DropdownMenuItem
      className="cursor-pointer gap-x-2 py-1"
      onClick={handleDeleteNote}
    >
      <DropdownMenuShortcut className="ml-0">
        <Trash2 className="w-4 h-4 text-red-700" />
      </DropdownMenuShortcut>
      Delete
    </DropdownMenuItem>
  );
}
