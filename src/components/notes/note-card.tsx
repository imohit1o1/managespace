import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EllipsisVertical, Pin, Star } from "lucide-react";
import Note from "@/types/interfaces";

interface NoteCardProps {
  note: Note; // Receive a single note as a prop
}

export default function NoteCard({ note }: NoteCardProps) {
  const { title, description, isPinned, isFavorite, createdAt } = note;

  return (
    <Card className={`border rounded-md bg-muted/50`}>
      <CardHeader className="p-4 space-y-0 grid grid-cols-2 justify-between">
        <CardTitle className={`truncate text-sm lg:text-md`}>{title}</CardTitle>
        <section className="justify-end flex items-center gap-x-1 text-muted-foreground">
          {/* Pinned icon */}
          {isPinned && <Pin className="w-4 h-4 text-muted-foreground" />}
          {/* Favourite icon */}
          {isFavorite && <Star className="w-4 h-4 text-muted-foreground" />}
          {/* Menu button */}
          <EllipsisVertical className="w-4 h-4" />
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
