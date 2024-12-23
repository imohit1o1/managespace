import { auth } from "@/config/auth";

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
        message: "Session is still loading. Please wait.",
      };
    }

    // If session exists but no user is authenticated
    if (!session.user) {
      return {
        user: null,
        loading: false,
        authenticated: false,
        message: "No authenticated user found. Please log in.",
      };
    }

    // If session is authenticated
    return {
      user: session.user,
      loading: false,
      authenticated: true,
      message: "User successfully authenticated.",
    };
  } catch (error) {
    // Handle errors (e.g., session fetch failure)
    return {
      user: null,
      loading: false,
      authenticated: false,
      message: `An error occurred: ${error.message || "Unknown error"}`,
    };
  }
};
