"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { NoteSchemaType } from "@/schema/noteSchema";
import { handleAxiosError } from "@/lib/axios-error-handler";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "./use-toast";

// Fetch notes whenever the tab changes
const fetchNotes = async (tab: string = "all") => {
    try {
        const response = await axios.get(`/api/notes?tab=${tab}`);
        return response.data;
    } catch (error) {
        return handleAxiosError(error as AxiosError<ApiResponse>, "Error fetching notes");
    }
};

// Create a note
const createNote = async (noteData: NoteSchemaType) => {
    try {
        const response = await axios.post("/api/notes", noteData);
        const { success, message, data } = response.data;
        if (success) {
            toast({ title: message, })
            return data;
        }
    } catch (error) {
        return handleAxiosError(error as AxiosError<ApiResponse>, "Error creating notes");
    }
}

// Update a note
const updateNote = async (noteId: string, updatedNoteData: NoteSchemaType) => {
    const response = await axios.put(`/api/notes/${noteId}`, updatedNoteData);
    const { success, message, data } = response.data;
    if (success) {
        toast({ title: message, })
        return data;
    }
};

// Delete a note
// const deleteNote = async (noteId: string) => {
//     const response = await axios.delete(`/api/notes/${noteId}`);
//     return response.data.notes;
// };

export const useNotes = (currentTab?: string) => {
    // const [currentTab, setCurrentTab] = useState<string>("all");
    // const router = useRouter();
    // useEffect(() => {
    //     router.push(`/dashboard/user/notes/?tab=${currentTab}`);
    // }, [currentTab, router]);

    const queryClient = useQueryClient();

    // 1. Fetching the notes list from the server 
    const {
        isLoading: isFetchingNotes,
        isError: isFetchingNotesError,
        error: fetchNotesError,
        data: fetchedNotes,
    } = useQuery({
        queryKey: ["fetchedNotes", currentTab],
        queryFn: () => fetchNotes(currentTab),
    });

    const { totalNotes = 0, totalPinnedNotes = 0, totalFavoriteNotes = 0 } = fetchedNotes || {};

    // 2. Creating a new note
    const { isPending: isCreating, mutateAsync: createNoteMutate, } = useMutation({
        mutationFn: createNote,
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
    // const { isPending: isDeleting, mutateAsync: deleteNoteMutate, } = useMutation({
    //     mutationFn: deleteNote,
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({ queryKey: ["fetchedNotes"] }); // Correctly invalidate queries
    //     },
    //     onError: (error) => {
    //         console.log("Error creating note:", error);
    //     },
    // });

    return {
        isFetchingNotes,
        isFetchingNotesError,
        fetchNotesError,
        fetchedNotes: fetchedNotes?.notes,
        totalNotes,
        totalPinnedNotes,
        totalFavoriteNotes,
        isCreating,
        createNoteMutate,
        isUpdating,
        updateNoteMutate,
        // isDeleting,
        // deleteNoteMutate,
    };
};

