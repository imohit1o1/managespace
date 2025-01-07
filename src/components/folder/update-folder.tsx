"use client";
import DialogWrapper from "@/components/dialog-wrapper";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import React, { useState } from "react";
import FolderForm from "@/components/folder/folder-form";
import { useFolders } from "@/hooks/use-folders";
import { FolderSchemaType } from "@/schema/folderSchema";
import { Folder } from "@prisma/client";

export default function UpdateFolder({ notesFolder }: { notesFolder: Folder }) {
  const [open, setOpen] = useState(false);
  const { isUpdatingFolder, updateFolderMutate } = useFolders();

  const onSubmit = async (data: FolderSchemaType) => {
    await updateFolderMutate(
      { notesFolderId: notesFolder.id, updatedFolderData: data },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };
  return (
    <DialogWrapper
      trigger={
        <Button
          aria-label="Rename Folder"
          variant="editFolder"
          size="icon"
          className=" hover:text-primary"
        >
          <SquarePen className="h-4 w-4" />
        </Button>
      }
      open={open}
      setOpen={() => setOpen(!open)}
      dialogIcon="/folder.png"
      dialogSize="sm:max-w-[270px]"
    >
      <FolderForm
        defaultValues={{
          name: notesFolder.name,
        }}
        onSubmit={onSubmit}
        submitButtonText="Rename"
        isSubmitting={isUpdatingFolder}
        isSubmittingText="Renaming"
      />
    </DialogWrapper>
  );
}
