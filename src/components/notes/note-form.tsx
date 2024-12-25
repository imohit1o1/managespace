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
import { Textarea } from "@/components/ui/textarea";
import useNoteApi from "@/hooks/use-notes-api";
import Note from "@/types/interfaces";
import { useEffect } from "react";

interface NoteFormProps {
  isOpen: boolean; // Control dialog open/close state externally
  onClose: () => void; // Handle closing dialog externally
  mode: "create" | "edit" | "view"; // Define mode for form behavior
  defaultValues: NoteSchema | Note;
  submitButtonText: string;
  onSuccess: () => void; // Callback to refetch notes after submission
}

export function NoteForm({
  isOpen,
  onClose,
  mode,
  defaultValues,
  submitButtonText,
  onSuccess,
}: NoteFormProps) {
  const { createNote, updateNote, loading } = useNoteApi();

  const form = useForm<NoteSchema>({
    resolver: zodResolver(noteSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues); // Reset the form with the new default values
  }, [defaultValues, form]);

  const handleSubmit = async (data: NoteSchema) => {
    try {
      if (mode === "create") {
        await createNote(data);
      } else if (mode === "edit") {
        const noteId = (defaultValues as Note).id;
        await updateNote(noteId, data);
      }
      onClose(); // Close the dialog
      onSuccess(); // Refresh the notes
      form.reset(); // Reset the form
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };
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
          {mode !== "view" && (
            <DialogDescription>
              {mode === "create"
                ? "Add a new note here. Click save when you're done."
                : "Edit the note here. Click save when you're done."}
            </DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
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
                      disabled={mode === "view"}
                      {...field}
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
                      className="md:h-[300px] h-[200px]"
                      placeholder="Write your description here..."
                      disabled={mode === "view"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="isPinned"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                  <label
                    htmlFor="isPinned"
                    className="text-sm font-medium ml-2"
                  >
                    Pinned
                  </label>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="isFavorite"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                  <label
                    htmlFor="isFavorite"
                    className="text-sm font-medium ml-2"
                  >
                    Favorite
                  </label>
                  <FormMessage />
                </FormItem>
              )}
            />
            {mode !== "view" && (
              <DialogFooter>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading
                    ? mode === "create"
                      ? "Creating..."
                      : "Updating..."
                    : submitButtonText}
                </Button>
              </DialogFooter>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
