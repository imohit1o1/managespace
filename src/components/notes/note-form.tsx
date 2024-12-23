import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
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
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

interface NoteFormProps {
  onNoteCreated: () => void; // Callback to refetch notes after submission
}

export function NoteForm({ onNoteCreated }: NoteFormProps) {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const form = useForm<NoteSchema>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
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
      await axios.post("/api/notes", data);
      toast({ title: "Note created successfully!" });
      onNoteCreated(); // Call the callback to refresh the notes
    } catch (error) {
      console.error("Error creating note:", error);
      toast({ title: "Error creating note" });
    } finally {
      setLoading(false);
      setDialogOpen(false);
      form.reset();
    }
  };

  const handleDialogChange = (isOpen: boolean) => {
    setDialogOpen(isOpen);
    if (isOpen) {
      form.reset();
    }
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          aria-label="Create a new note"
          variant="notemenu"
          size="notemenu"
          className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 z-90"
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[300px] md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
          <DialogDescription>
            Add a new note here. Click save when you&apos;re done.
          </DialogDescription>
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
                    <Input placeholder="Enter your Title here" {...field} />
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
            <DialogFooter>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Saving..." : "Save Note"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
