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
import { folderSchema, type FolderSchemaType } from "@/schema/folderSchema";

interface FolderFormProps {
  defaultValues: FolderSchemaType;
  onSubmit?: (data: FolderSchemaType) => void;
  submitButtonText?: string;
  isSubmitting?: boolean;
  isSubmittingText?: string;
  viewMode?: boolean;
}

export default function FolderForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
  isSubmittingText,
  viewMode = false,
}: FolderFormProps) {
  const form = useForm<FolderSchemaType>({
    resolver: zodResolver(folderSchema),
    defaultValues,
  });

  // Fallback for onSubmit if it's undefined
  const handleSubmit: SubmitHandler<FolderSchemaType> = onSubmit || (() => {});
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Folder name"
                  {...field}
                  disabled={viewMode}
                />
              </FormControl>

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
