"use client";
import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import Note from "@/types/interfaces";

const useNotesFetch = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totals, setTotals] = useState({
    totalNotes: 0,
    totalPinnedNotes: 0,
    totalFavoriteNotes: 0,
  });

  const fetchNotes = useCallback(async (tab: string = "all") => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/notes?tab=${tab}`);
      console.log("Response from server: ", response.data);

      setNotes(response.data.notes || []);
      setTotals({
        totalNotes: response.data.totalNotes || 0,
        totalPinnedNotes: response.data.totalPinnedNotes || 0,
        totalFavoriteNotes: response.data.totalFavoriteNotes || 0,
      });
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast({ title: "Error fetching notes" });
    } finally {
      setLoading(false);
    }
  }, []);

  return { notes, loading, totals, fetchNotes };
};

export default useNotesFetch;
