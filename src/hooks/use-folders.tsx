"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { FolderSchemaType } from "@/schema/folderSchema"; // You need to define this schema
import { handleAxiosError } from "@/lib/axios-error-handler";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "./use-toast";

// Fetch all notes folder
const fetchFolders = async () => {
  try {
    const response = await axios.get("/api/notes-folder");
    return response.data;
  } catch (error) {
    return handleAxiosError(
      error as AxiosError<ApiResponse>,
      "Error fetching folders"
    );
  }
};

// Create a folder
const createFolder = async (notesFolderData: FolderSchemaType) => {
  try {
    const response = await axios.post("/api/notes-folder", notesFolderData);
    const { success, message, data } = response.data;
    if (success) {
      toast({ title: message });
      return data;
    }
  } catch (error) {
    return handleAxiosError(
      error as AxiosError<ApiResponse>,
      "Error creating folder"
    );
  }
};

// Update a folder
const updateFolder = async (
  folderId: string,
  updatedFolderData: FolderSchemaType
) => {
  const response = await axios.put(
    `/api/folders/${folderId}`,
    updatedFolderData
  );
  const { success, message, data } = response.data;
  if (success) {
    toast({ title: message });
    return data;
  }
};

// Delete a folder
const deleteFolder = async (folderId: string) => {
  const response = await axios.delete(`/api/folders/${folderId}`);
  const { success, message } = response.data;
  if (success) {
    toast({ title: message });
  }
};

export const useFolders = () => {
  const queryClient = useQueryClient();

  // 1. Fetching the folder list from the server
  const {
    isLoading: isFetchingFolders,
    isError: isFetchingFoldersError,
    error: fetchFoldersError,
    data: fetchedFolders,
  } = useQuery({
    queryKey: ["fetchedFolders"],
    queryFn: () => fetchFolders(),
  });

  const { totalFolders = 0 } = fetchedFolders || {};

  // 2. Creating a new folder
  const { isPending: isCreatingFolder, mutateAsync: createFolderMutate } =
    useMutation({
      mutationFn: createFolder,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["fetchedFolders"] });
      },
    });

  // 3. Update an existing folder
  const { isPending: isUpdatingFolder, mutateAsync: updateFolderMutate } =
    useMutation({
      mutationFn: ({
        folderId,
        updatedFolderData,
      }: {
        folderId: string;
        updatedFolderData: FolderSchemaType;
      }) => updateFolder(folderId, updatedFolderData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["fetchedFolders"] });
      },
    });

  // 4. Delete an existing folder
  const { isPending: isDeletingFolder, mutateAsync: deleteFolderMutate } =
    useMutation({
      mutationFn: deleteFolder,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["fetchedFolders"] });
      },
    });

  return {
    isFetchingFolders,
    isFetchingFoldersError,
    fetchFoldersError,
    fetchedFolders: fetchedFolders?.folders,
    totalFolders,
    isCreatingFolder,
    createFolderMutate,
    isUpdatingFolder,
    updateFolderMutate,
    isDeletingFolder,
    deleteFolderMutate,
  };
};
