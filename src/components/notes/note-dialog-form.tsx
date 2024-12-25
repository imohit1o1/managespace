"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noteSchema, type NoteSchema } from "@/schema/noteSchema";
import { useState } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

interface NoteDialogProps {
  mode: "create" | "edit" | "view";
  note?: NoteSchema; // Optional, used in edit or view mode
  onSuccess?: () => void; // Callback for refreshing notes
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
}

export default function NoteDialog({
  mode,
  note,
  onSuccess,
  isOpen,
  onClose,
}: NoteDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<NoteSchema>({
    resolver: zodResolver(noteSchema),
    defaultValues: note || {
      title: "",
      description: "",
      isPinned: false,
      isFavorite: false,
      backgroundColor: "bg-muted/30",
      textColor: "text-foreground",
    },
  });

  const handleSubmit = async (data: NoteSchema) => {
    try {
      setLoading(true);
      if (mode === "create") {
        await axios.post("/api/notes", data);
        toast({ title: "Note created successfully!" });
      } else if (mode === "edit") {
        await axios.put(`/api/notes/${note?.id}`, data); // Update the note
        toast({ title: "Note updated successfully!" });
      }
      if (onSuccess) onSuccess(); // Refresh notes
    } catch (error) {
      console.error("Error saving note:", error);
      toast({ title: `Error ${mode === "create" ? "creating" : "updating"} note` });
    } finally {
      setLoading(false);
      onClose(false);
    }
  };

  const isReadOnly = mode === "view";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[300px] md:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Create Note"
              : mode === "edit"
              ? "Edit Note"
              : "View Note"}
          </DialogTitle>
          <DialogDescription>
            {mode === "view"
              ? "View your note details below."
              : "Fill out the form below and save your changes."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={isReadOnly ? undefined : form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter your Title here"
                      {...field}
                      disabled={isReadOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="md:h-[300px] h-[200px]"
                      placeholder="Write your content here..."
                      disabled={isReadOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isReadOnly && (
              <DialogFooter>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading
                    ? mode === "create"
                      ? "Creating..."
                      : "Updating..."
                    : mode === "create"
                    ? "Create Note"
                    : "Update Note"}
                </Button>
              </DialogFooter>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
