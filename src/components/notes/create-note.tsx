"use client";

import { Button } from "@/components/ui/button";
import { type NoteSchemaType } from "@/schema/noteSchema";
import { useState } from "react";
import NoteForm from "@/components/notes/note-form";
import { Plus } from "lucide-react";
import DialogWrapper from "../dialog-wrapper";
import { useNotes } from "@/hooks/use-notes";

interface CreateNoteProps {
  notesFolderId?: string;
}

export default function CreateNote({ notesFolderId }: CreateNoteProps) {
  const [open, setOpen] = useState(false);
  const { isCreating, createNoteMutate } = useNotes();

  const onSubmit = (noteData: NoteSchemaType) => {
    createNoteMutate(
      { noteData, notesFolderId },
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
          aria-label="Create a new note"
          variant="notemenu"
          size="notemenu"
          className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 z-90"
        >
          <Plus />
        </Button>
      }
      dialogTitle="Create Note"
      dialogDescription="Add a new note to the list"
      open={open}
      setOpen={() => setOpen(!open)}
    >
      <NoteForm
        defaultValues={{
          title: "",
          description: "",
          isPinned: false,
          isFavorite: false,
          backgroundColor: "bg-muted/30",
          textColor: "text-foreground",
        }}
        onSubmit={onSubmit}
        submitButtonText="Create"
        isSubmitting={isCreating}
        isSubmittingText="Creating"
      />
    </DialogWrapper>
  );
}
