import React from "react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Notes } from "@prisma/client";
import UpdateNote from "./update-note";
import DeleteNote from "./delete-note";
import ViewNote from "./view-note";

interface NoteCardProps {
  note: Notes;
}

export default function NoteCard({ note }: NoteCardProps) {
  return (
    <Card className={`border rounded-md bg-muted/50`}>
      <CardHeader className="p-4 space-y-0 grid grid-cols-2 justify-between">
        <CardTitle className={`truncate text-sm lg:text-md`}>
          {note.title}
        </CardTitle>
        <section className="justify-end flex items-center gap-x-1 text-muted-foreground">
          {/* Pinned icon */}
          {note.isPinned && <Pin className="w-4 h-4 text-muted-foreground" />}
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
                {/* Update note component */}
                <UpdateNote note={note} />
                <DropdownMenuSeparator className="bg-muted/50" />
                {/* View note component */}
                <ViewNote note={note} />
                <DropdownMenuSeparator className="bg-muted/50" />
                {/* Delete note component */}
                <DeleteNote noteId={note.id} />
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
  );
}
