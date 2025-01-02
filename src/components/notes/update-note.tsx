"use client";
import { useState } from "react";
import NoteForm from "@/components/notes/note-form";
import { type NoteSchemaType } from "@/schema/noteSchema";
import { Notes } from "@prisma/client";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { SquarePen } from "lucide-react";
import DialogWrapper from "@/components/dialog-wrapper";
import { useNotes } from "@/hooks/use-notes";

export default function UpdateNote({ note }: { note: Notes }) {
  const [open, setOpen] = useState(false);
  const { isUpdating, updateNoteMutate } = useNotes();

  const onSubmit = async (data: NoteSchemaType) => {
    await updateNoteMutate(
      { noteId: note.id, updatedNoteData: data },
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
        <DropdownMenuItem
          className="cursor-pointer gap-x-2 py-1"
          onSelect={(e) => e.preventDefault()}
        >
          <DropdownMenuShortcut className="ml-0">
            <SquarePen className="w-4 h-4" />
          </DropdownMenuShortcut>
          Edit
        </DropdownMenuItem>
      }
      dialogTitle="Update Note"
      dialogDescription="Edit your note"
      open={open}
      setOpen={() => setOpen(!open)}
    >
      <NoteForm
        defaultValues={{
          title: note.title || "",
          description: note.description || "",
          isPinned: note.isPinned || false,
          isFavorite: note.isFavorite || false,
          backgroundColor: note.backgroundColor || "",
          textColor: note.textColor || "",
        }}
        onSubmit={onSubmit}
        submitButtonText="Update"
        isSubmitting={isUpdating}
        isSubmittingText="Updating..."
      />
    </DialogWrapper>
  );
}
