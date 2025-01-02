"use client";
import { useState } from "react";
import NoteForm from "@/components/notes/note-form";
import { Notes } from "@prisma/client";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Eye } from "lucide-react";
import DialogWrapper from "@/components/dialog-wrapper";

export default function ViewNote({ note }: { note: Notes }) {
  const [open, setOpen] = useState(false);

  return (
    <DialogWrapper
      trigger={
        <DropdownMenuItem
          className="cursor-pointer gap-x-2 py-1"
          onSelect={(e) => e.preventDefault()}
        >
          <DropdownMenuShortcut className="ml-0">
            <Eye className="w-4 h-4" />
          </DropdownMenuShortcut>
          View
        </DropdownMenuItem>
      }
      dialogTitle="View Note"
      dialogDescription="See your note details"
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
        viewMode={true}
      />
    </DialogWrapper>
  );
}
