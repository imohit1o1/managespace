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
import Note from "@/types/interfaces";
import { NoteCardMenu } from "./note-card-menu";
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

interface NoteCardProps {
  note: Note; // Receive a single note as a prop
}

export default function NoteCard({ note }: NoteCardProps) {
  const { id, title, description, isPinned, isFavorite, createdAt } = note;
  const handleDelete = () => {
    console.log("note id is ", id);
  };
  return (
    <Card className={`border rounded-md bg-muted/50`}>
      <CardHeader className="p-4 space-y-0 grid grid-cols-2 justify-between">
        <CardTitle className={`truncate text-sm lg:text-md`}>{title}</CardTitle>
        <section className="justify-end flex items-center gap-x-1 text-muted-foreground">
          {/* Pinned icon */}
          {isPinned && <Pin className="w-4 h-4 text-muted-foreground" />}
          {/* Favourite icon */}
          {isFavorite && <Star className="w-4 h-4 text-muted-foreground" />}

          {/* Note Card Menu Opening */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <EllipsisVertical className="w-4 h-4 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" cursor-pointer">
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer gap-x-2 py-1">
                  <DropdownMenuShortcut className="ml-0">
                    <SquarePen className="w-4 h-4" />
                  </DropdownMenuShortcut>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-muted/50" />

                <DropdownMenuItem className="cursor-pointer gap-x-2 py-1">
                  <DropdownMenuShortcut className="ml-0">
                    <Eye className="w-4 h-4" />
                  </DropdownMenuShortcut>
                  View
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-muted/50" />

                <DropdownMenuItem
                  className="cursor-pointer gap-x-2 py-1 text--700"
                  onClick={handleDelete}
                >
                  <DropdownMenuShortcut className="ml-0">
                    <Trash2 className="w-4 h-4 text-red-700" />
                  </DropdownMenuShortcut>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {/*Note Card Menu Closing  */}
        </section>
      </CardHeader>
      <CardContent className="px-4 h-36 max-h-36 overflow-hidden">
        <CardDescription className={`leading-snug`}>
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="justify-self-end p-4 items-center">
        <p className="text-xs text-muted-foreground">
          {new Date(createdAt).toLocaleDateString("en-GB")}
        </p>
      </CardFooter>
    </Card>
  );
}
