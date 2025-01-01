import { auth } from "@/config/auth";
import { messages } from "@/lib/messages";

export const currentUser = async () => {
  try {
    // Fetch the session using the authentication method
    const session = await auth();

    // If session is loading
    if (!session) {
      return {
        user: null,
        loading: true,
        authenticated: false,
        message: messages.error.user.session_loading,
      };
    }

    // If session exists but no user is authenticated
    if (!session.user) {
      return {
        user: null,
        loading: false,
        authenticated: false,
        message: messages.error.user.session_not_found,
      };
    }

    // If session is authenticated
    return {
      user: session.user,
      loading: false,
      authenticated: true,
      message: messages.success.user.session_found,
    };
  } catch (error) {
    console.log("Unknown error occurred while fetching the user", error);

    return {
      user: null,
      loading: false,
      authenticated: false,
      message: messages.error.user.fetch_error,
    };
  }
};
