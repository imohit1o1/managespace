import React from "react";
import { Trash2 } from "lucide-react";
import { useFolders } from "@/hooks/use-folders";
import { Button } from "../ui/button";

export default function DeleteFolder({ folderId }: { folderId: string }) {
  const { deleteFolderMutate } = useFolders();

  const handleDeleteNote = async () => {
    await deleteFolderMutate(folderId);
  };

  return (
    <Button
      aria-label="Delete Folder"
      variant="editFolder"
      size="icon"
      className="hover:text-destructive"
      onClick={handleDeleteNote}
    >
      <Trash2 className="w-4 h-4 " />
    </Button>
  );
}
