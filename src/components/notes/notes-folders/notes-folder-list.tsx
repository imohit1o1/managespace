"use client"
import React from "react";
import { Loader2 } from "lucide-react";
import { Folder } from "@prisma/client";
import FolderCard from "@/components/folder/folder-card";
import { useFolders } from "@/hooks/use-folders";

export default function NotesFolderList() {
  const {
    isFetchingFolders,
    isFetchingFoldersError,
    fetchFoldersError,
    fetchedFolders,
  } = useFolders();
  // Render loading state
  if (isFetchingFolders) {
    return (
      <div className="flex justify-center items-center py-4">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading Folders...</span>
      </div>
    );
  }

  // Render error state
  if (isFetchingFoldersError) {
    return (
      <div className="py-4 text-center">
        <p className="text-red-500">{fetchFoldersError?.message}</p>
      </div>
    );
  }

  // Render no notes state
  if (fetchedFolders.length === 0) {
    return (
      <div className="py-4 text-center">
        <p>No folders available. Try creating some!</p>
      </div>
    );
  }

  // Render notes list
  return (
    <section className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 overflow-hidden">
      {fetchedFolders.map((folder: Folder) => (
        <FolderCard key={folder.id} folder={folder} />
      ))}
    </section>
  );
}
