import React from "react";
import Note from "@/types/interfaces";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pin, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Eye, SquarePen, Trash2 } from "lucide-react";

interface NoteListProps {
  notes: Note[];
  isLoading: boolean;
  // error: boolean;
  onEdit: (note: Note) => void;
  onView: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

export default function NoteList({
  notes,
  isLoading,
  onEdit,
  onView,
  onDelete,
}: NoteListProps) {
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
        <Card key={note.id} className={`border rounded-md bg-muted/50`}>
          <CardHeader className="p-4 space-y-0 grid grid-cols-2 justify-between">
            <CardTitle className={`truncate text-sm lg:text-md`}>
              {note.title}
            </CardTitle>
            <section className="justify-end flex items-center gap-x-1 text-muted-foreground">
              {/* Pinned icon */}
              {note.isPinned && (
                <Pin className="w-4 h-4 text-muted-foreground" />
              )}
              {/* Favourite icon */}
              {note.isFavorite && (
                <Star className="w-4 h-4 text-muted-foreground" />
              )}
              {/* Note Card Menu Opening */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <EllipsisVertical className="w-4 h-4 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className=" cursor-pointer">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="cursor-pointer gap-x-2 py-1"
                      onClick={() => onEdit(note)}
                    >
                      <DropdownMenuShortcut className="ml-0">
                        <SquarePen className="w-4 h-4" />
                      </DropdownMenuShortcut>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-muted/50" />
                    <DropdownMenuItem
                      className="cursor-pointer gap-x-2 py-1"
                      onClick={() => onView(note)}
                    >
                      <DropdownMenuShortcut className="ml-0">
                        <Eye className="w-4 h-4" />
                      </DropdownMenuShortcut>
                      View
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-muted/50" />
                    <DropdownMenuItem
                      className="cursor-pointer gap-x-2 py-1 text--700"
                      onClick={() => onDelete(note.id)}
                    >
                      <DropdownMenuShortcut className="ml-0">
                        <Trash2 className="w-4 h-4 text-red-700" />
                      </DropdownMenuShortcut>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              {/*Note Card Menu Closing */}
            </section>
          </CardHeader>
          <CardContent className="px-4 h-36 max-h-36 overflow-hidden">
            <CardDescription className={`leading-snug`}>
              {note.description}
            </CardDescription>
          </CardContent>
          <CardFooter className="justify-self-end p-4 items-center">
            <p className="text-xs text-muted-foreground">
              {new Date(note.createdAt).toLocaleDateString("en-GB")}
            </p>
          </CardFooter>
        </Card>
      ))}
    </section>
  );
}
