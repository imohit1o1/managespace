"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NoteList from "@/components/notes/note-list";
import CreateNote from "@/components/notes/create-note";
import { useNotes } from "@/hooks/use-notes";
import { useTabManagement } from "@/hooks/use-tab-management";

export default function NotesHomePage() {
  const { currentTab, setCurrentTab } = useTabManagement();
  const {
    isFetchingNotes,
    isFetchingNotesError,
    fetchNotesError,
    fetchedNotes,
  } = useNotes(currentTab);

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
        notes={fetchedNotes}
        isLoading={isFetchingNotes}
        isError={isFetchingNotesError}
        error={fetchNotesError}
      />

      <CreateNote />
    </main>
  );
}
