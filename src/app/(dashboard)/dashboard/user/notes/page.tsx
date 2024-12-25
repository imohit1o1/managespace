"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoteForm } from "@/components/notes/note-form";
import NoteList from "@/components/notes/note-list";
import { useRouter } from "next/navigation";
import useNoteApi from "@/hooks/use-notes-api";
import { Button } from "@/components/ui/button";
import Note from "@/types/interfaces";

export default function NotesHomePage() {
  const [currentTab, setCurrentTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control the dialog
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { notes, loading, fetchNotes, deleteNote } = useNoteApi();
  const router = useRouter();

  useEffect(() => {
    router.push(`/dashboard/user/notes/?tab=${currentTab}`);
    fetchNotes(currentTab);
  }, [currentTab, fetchNotes, router]);

  const handleOpenDialog = (mode: "create" | "edit" | "view", note?: Note) => {
    setDialogMode(mode);
    if (note) {
      setSelectedNote(note); // Set the selected note for edit or view
    } else {
      setSelectedNote(null); // For create, clear any existing note
    }
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleDelete = async (noteId: string) => {
    try {
      await deleteNote(noteId);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <main className="flex flex-col gap-4 relative">
      {/* Note Header */}
      <section className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="order-2 md:order-1">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pinned">Pinned</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center relative lg:min-w-72 min-w-60 md:order-2">
          <Search className="w-5 h-5 absolute left-3 text-muted-foreground" />
          <Input placeholder="Search notes..." className="pl-10" />
        </div>
      </section>

      {/* Notes List */}
      <NoteList
        notes={notes}
        isLoading={loading}
        onEdit={(note) => handleOpenDialog("edit", note)}
        onView={(note) => handleOpenDialog("view", note)}
        onDelete={handleDelete}
      />

      {/* Button to open the note creation form */}
      <Button
        aria-label="Create a new note"
        variant="notemenu"
        size="notemenu"
        className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 z-90"
        onClick={() => handleOpenDialog("create")}
      >
        <Plus />
      </Button>

      {/* Button to open the note creation form */}
      <NoteForm
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        defaultValues={
          dialogMode === "create"
            ? {
                title: "",
                description: "",
                isPinned: false,
                isFavorite: false,
                backgroundColor: "bg-muted/30",
                textColor: "text-foreground",
              }
            : {
                id: selectedNote?.id || "",
                title: selectedNote?.title || "",
                description: selectedNote?.description || "",
                isPinned: selectedNote?.isPinned || false,
                isFavorite: selectedNote?.isFavorite || false,
                backgroundColor: selectedNote?.backgroundColor || "bg-muted/30",
                textColor: selectedNote?.textColor || "text-foreground",
                createdAt: selectedNote?.createdAt,
              } // Pass the selected note data for edit or view
        }
        mode={dialogMode}
        submitButtonText={dialogMode === "create" ? "Create" : "Update"}
        onSuccess={() => fetchNotes()}
      />
    </main>
  );
}
