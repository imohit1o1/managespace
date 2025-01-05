"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { NoteSchemaType } from "@/schema/noteSchema";
import { handleAxiosError } from "@/lib/axios-error-handler";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "./use-toast";

// 1. Fetch notes whenever the tab changes
const fetchNotes = async (tab: string = "all", notesFolderId?: string) => {
    try {
        const url = notesFolderId ? `/api/notes-folder/${notesFolderId}?tab=${tab}` : `/api/notes?tab=${tab}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        return handleAxiosError(error as AxiosError<ApiResponse>, "Error fetching notes");
    }
};

// 2. Create a note
const createNote = async (noteData: NoteSchemaType, notesFolderId?: string) => {
    try {
        const url = notesFolderId ? `/api/notes-folder/${notesFolderId}` : `/api/notes`;
        const response = await axios.post(url, noteData);
        const { success, message, data } = response.data;
        if (success) {
            toast({ title: message, })
            return data;
        }
    } catch (error) {
        return handleAxiosError(error as AxiosError<ApiResponse>, "Error creating notes");
    }
}

// 3. Update a note
const updateNote = async (noteId: string, updatedNoteData: NoteSchemaType) => {
    const response = await axios.put(`/api/notes/${noteId}`, updatedNoteData);
    const { success, message, data } = response.data;
    if (success) {
        toast({ title: message, })
        return data;
    }
};

// 4. Delete a note
const deleteNote = async (noteId: string) => {
    const response = await axios.delete(`/api/notes/${noteId}`);
    const { success, message } = response.data;
    if (success) {
        toast({ title: message, })
    }
};

export const useNotes = (currentTab: string, notesFolderId?: string) => {
    const queryClient = useQueryClient();

    // 1. Fetching the notes list from the server based on tab
    const {
        isLoading: isFetchingNotes,
        isError: isFetchingNotesError,
        error: fetchNotesError,
        data: fetchedNotes,
    } = useQuery({
        queryKey: ["fetchedNotes", currentTab, notesFolderId],
        queryFn: () => fetchNotes(currentTab, notesFolderId),
    });

    const { totalNotes = 0, totalPinnedNotes = 0, totalFavoriteNotes = 0 } = fetchedNotes || {};

    // 2. Creating a new note
    const { isPending: isCreating, mutateAsync: createNoteMutate, } = useMutation({
        mutationFn: ({ noteData, notesFolderId }: { noteData: NoteSchemaType; notesFolderId?: string }) => (createNote(noteData, notesFolderId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fetchedNotes"] });
        },
    });

    // 3. Update an existing note
    const { isPending: isUpdating, mutateAsync: updateNoteMutate, } = useMutation({
        mutationFn: ({ noteId, updatedNoteData }: { noteId: string; updatedNoteData: NoteSchemaType }) =>
            updateNote(noteId, updatedNoteData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fetchedNotes"] });
        },
    });

    // 4. Delete an existing note
    const { isPending: isDeleting, mutateAsync: deleteNoteMutate, } = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fetchedNotes"] });
        },
    });


    return {
        isFetchingNotes,
        isFetchingNotesError,
        fetchNotesError,
        fetchedNotes: fetchedNotes?.notes || fetchedNotes?.folderNotes,
        totalNotes,
        totalPinnedNotes,
        totalFavoriteNotes,
        isCreating,
        createNoteMutate,
        isUpdating,
        updateNoteMutate,
        isDeleting,
        deleteNoteMutate,
    };
};

