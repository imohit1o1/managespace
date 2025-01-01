import { register } from "module";

export const messages = {
    success: {
        user: {
            username: {
                unique: "Username is unique",
            },
            created: "User created successfully.",
            session_found: "User successfully authenticated.",
        },
        notes: {
            fetch: "Notes Fetched Successfully.",
            create: "Note Created Successfully",
            update: "Note Updated Successfully",
            delete: "Note Deleted Successfully",
        },
        todos: {},
        signup: {
            user: {
                register: "User registered successfully",
            }
        },
    },
    error: {
        signup: {
            user: {
                validation: "SignUp Validation failed",
                register: "Error registering user"
            }
        },
        user: {
            username: {
                error: "An error while checking username",
                invalid_query: "Invalid query parameters"
            },
            email: "Email address already exists",
            created: "User created successfully.",
            updated: "User updated successfully.",
            deleted: "User deleted successfully.",
            user_not_found: "User not found.",
            invalid_data: "Invalid user data",
            session_loading: "Session is still loading. Please wait.",
            session_not_found: "No authenticated user found. Please log in",
            fetch_error: "An error occurred while fetching the user",
        },
        notes: {
            validation: "Either title or description must be provided.",

            // FETCH ERROR
            fetch: "An error occurred while fetching notes.",

            // CREATE ERROR
            create: "An error occurred while creating note.",

            // UPDATE ERROR
            id_not_found: "Note ID is required.",
            not_found: "Note not found.",
            not_update_auth_user: "Forbidden: You cannot update this note.",
            update: "An error occurred while updating the note.",

            // DELETE ERROR
            not_delete_auth_user: "Forbidden: You cannot delete this note.",
            delete: "An error occurred while deleting the note",
        },
        todos: {},
    },
    warning: {
        username: {
            taken: "Username is already taken",
        },
    },
};
