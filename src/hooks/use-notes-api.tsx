"use client";
import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import Note from "@/types/interfaces";
import { type NoteSchema } from "@/schema/noteSchema";

const useNoteApi = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState({
    totalNotes: 0,
    totalPinnedNotes: 0,
    totalFavoriteNotes: 0,
  });

  // Fetch Notes
  const fetchNotes = useCallback(async (tab: string = "all") => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/notes?tab=${tab}`);
      setNotes(response.data.notes || []);
      setTotals({
        totalNotes: response.data.totalNotes || 0,
        totalPinnedNotes: response.data.totalPinnedNotes || 0,
        totalFavoriteNotes: response.data.totalFavoriteNotes || 0,
      });
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Error fetching notes");
      toast({ title: "Error fetching notes" });
    } finally {
      setLoading(false);
    }
  }, []);

  // Create Note
  const createNote = useCallback(
    async (data: NoteSchema, onSuccess?: () => void) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post("/api/notes", data);
        toast({ title: "Note created successfully!" });
        setNotes((prev) => [response.data.note, ...prev]); // Add new note to state
        if (onSuccess) onSuccess();
      } catch (err) {
        console.error("Error creating note:", err);
        setError("Error creating note");
        toast({ title: "Error creating note" });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update Note
  const updateNote = useCallback(
    async (id: string, data: Partial<Note>, onSuccess?: () => void) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.put(`/api/notes/${id}`, data);
        toast({ title: "Note updated successfully!" });
        setNotes((prev) =>
          prev.map((note) =>
            note.id === id ? { ...note, ...response.data.note } : note // update note from previous state
          )
        );
        if (onSuccess) onSuccess();
      } catch (err) {
        console.error("Error updating note:", err);
        setError("Error updating note");
        toast({ title: "Error updating note" });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete Note
  const deleteNote = useCallback(async (id: string, onSuccess?: () => void) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/notes/${id}`);
      toast({ title: "Note deleted successfully!" });
      setNotes((prev) => prev.filter((note) => note.id !== id)); // Remove note from state
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error deleting note:", err);
      setError("Error deleting note");
      toast({ title: "Error deleting note" });
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    notes,
    loading,
    error,
    totals,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  };
};

export default useNoteApi;
