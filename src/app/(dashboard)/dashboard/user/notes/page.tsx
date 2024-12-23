"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoteForm } from "@/components/notes/note-form";
import NoteList from "@/components/notes/note-list";
import useNotesFetch from "@/hooks/use-notes-fetch";
import { useRouter } from "next/navigation";

export default function NotesHomePage() {
  const [currentTab, setCurrentTab] = useState("all");
  const { notes, loading, fetchNotes } = useNotesFetch();
  const router = useRouter();

  useEffect(() => {
    router.push(`/dashboard/user/notes/?tab=${currentTab}`);
    fetchNotes(currentTab);
  }, [currentTab, fetchNotes, router]);

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
      <NoteList notes={notes} isLoading={loading} />

      {/* Button to open the note creation form */}
      <NoteForm onNoteCreated={() => fetchNotes()} />
    </main>
  );
}
