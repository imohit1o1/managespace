"use client";
import DialogWrapper from "@/components/dialog-wrapper";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import FolderForm from "@/components/folder/folder-form";
import { useFolders } from "@/hooks/use-folders";
import { FolderSchemaType } from "@/schema/folderSchema";

export default function CreateFolder() {
  const [open, setOpen] = useState(false);
  const { isCreatingFolder, createFolderMutate } = useFolders();

  const onSubmit = (data: FolderSchemaType) => {
    createFolderMutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <DialogWrapper
      trigger={
        <Button
          aria-label="Create a new note folder"
          variant="notemenu"
          size="notemenu"
          className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 z-90"
        >
          <Plus />
        </Button>
      }
      open={open}
      setOpen={() => setOpen(!open)}
      dialogIcon="/folder.png"
      dialogSize="sm:max-w-[270px]"
    >
      <FolderForm
        defaultValues={{
          name: "",
        }}
        onSubmit={onSubmit}
        submitButtonText="Create"
        isSubmitting={isCreatingFolder}
        isSubmittingText="Creating"
      />
    </DialogWrapper>
  );
}
