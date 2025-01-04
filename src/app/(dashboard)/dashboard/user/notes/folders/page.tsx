import CreateFolder from "@/components/folder/create-folder";
import NotesFolderList from "@/components/notes/notes-folders/notes-folder-list";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

export default function NotesFoldersHomePage() {
  return (
    <main className="flex flex-col gap-4 relative">
      {/* Note Header */}
      <section className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="flex items-center relative lg:min-w-72 min-w-60 md:order-2">
          <Search className="w-5 h-5 absolute left-3 text-muted-foreground" />
          <Input placeholder="Search notes folder..." className="pl-10" />
        </div>
      </section>

      <NotesFolderList />

      <CreateFolder />
    </main>
  );
}
