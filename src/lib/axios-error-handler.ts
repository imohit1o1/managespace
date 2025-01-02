import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/hooks/use-toast";

export function handleAxiosError(error: AxiosError<ApiResponse>, defaultMessage: string = "An API error occurred") {
    // Check if there's no response, which could indicate a network error
    if (!error.response) {
        // Handle network error
        toast({
            title: "Network error, please try again.",
            variant: "destructive",
        });
        return "Network error, please try again.";
    }

    if (error.response?.data) {
        const { success, message } = error.response.data;
        toast({
            title: message || defaultMessage,
            variant: success === true ? "default" : "destructive",
        });

        return message || defaultMessage;
    }
}
