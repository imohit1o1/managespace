"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { noteSchema, type NoteSchemaType } from "@/schema/noteSchema";

interface NoteFormProps {
  defaultValues: NoteSchemaType;
  onSubmit?: (data: NoteSchemaType) => void;
  submitButtonText?: string;
  isSubmitting?: boolean;
  isSubmittingText?: string;
  viewMode?: boolean;
}

export default function NoteForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
  isSubmittingText,
  viewMode = false,
}: NoteFormProps) {
  const form = useForm<NoteSchemaType>({
    resolver: zodResolver(noteSchema),
    defaultValues,
  });

  // Fallback for onSubmit if it's undefined
  const handleSubmit: SubmitHandler<NoteSchemaType> = onSubmit || (() => {});
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter your Title here"
                  {...field}
                  disabled={viewMode}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="md:h-[300px] h-[200px]"
                  placeholder="Write your description here..."
                  {...field}
                  disabled={viewMode}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="isPinned"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  disabled={viewMode}
                />
              </FormControl>

              <label htmlFor="isPinned" className="text-sm font-medium ml-2">
                Mark as Pinned
              </label>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="isFavorite"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  disabled={viewMode}
                />
              </FormControl>

              <label htmlFor="isPinned" className="text-sm font-medium ml-2">
                Mark as Favorite
              </label>

              <FormMessage />
            </FormItem>
          )}
        />
        {!viewMode && (
          <Button
            disabled={isSubmitting}
            className="w-full relative"
            type="submit"
          >
            {isSubmitting ? (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/50 rounded-md">
                {/* Loading Spinner */}
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>{isSubmittingText}</span>
              </div>
            ) : (
              <span>{submitButtonText}</span>
            )}
          </Button>
        )}
      </form>
    </Form>
  );
}
