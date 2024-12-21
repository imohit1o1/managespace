import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const { data: session, status } = useSession();

  // Return loading state
  if (status === "loading") {
    return {
      user: null,
      loading: true,
      authenticated: false,
    };
  }

  // Return unauthenticated state
  if (status === "unauthenticated" || !session?.user) {
    return {
      user: null,
      loading: false,
      authenticated: false,
    };
  }

  // Return the authenticated user
  return {
    user: session.user,
    loading: false,
    authenticated: true,
  };
};
