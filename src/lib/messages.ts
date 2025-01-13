export const messages = {
    success: {
        signup: {
            user: {
                register: "User registered successfully",
            }
        },
        user: {
            username: {
                unique: "Username is unique",
            },
            created: "User created successfully.",
            session_found: "User successfully authenticated.",
        },
        notes: {
            fetch: "All Notes Fetched Successfully.",
            create: "Note Created Successfully",
            update: "Note Updated Successfully",
            delete: "Note Deleted Successfully",
        },
        todos: {
            fetch: "All Todos Fetched Successfully.",
            create: "Todo Created Successfully",
            update: "Todo Updated Successfully",
            delete: "Todo Deleted Successfully",
        },
        folders: {
            fetch: "All Folders Fetched Successfully.",
            create: "Folder Created Successfully",
            update: "Folder Renamed Successfully",
            delete: "Folder Deleted Successfully",
        },
        labels: {
            fetch: "All Labels Fetched Successfully.",
            create: "Label Created Successfully",
            update: "Label Renamed Successfully",
            delete: "Label Deleted Successfully",
        },
        remarks: {
            fetch: "All Remarks Fetched Successfully.",
            create: "Remark Created Successfully",
            update: "Remark Updated Successfully",
            delete: "Remark Deleted Successfully",
        },
        dailyGoals: {
            fetch: "All Daily Goals Fetched Successfully.",
            create: "Daily Goal Created Successfully",
            update: "Daily Goal Updated Successfully",
            delete: "Daily Goal Deleted Successfully",
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
            delete: "An error occurred while deleting the note.",
        },
        todos: {
            // FETCH ERROR
            fetch: "An error occurred while fetching todos.",

            // CREATE ERROR
            create: "An error occurred while creating todo.",

            // UPDATE ERROR
            id_not_found: "Todo ID is required.",
            not_found: "Todo not found.",
            not_update_auth_user: "Forbidden: You cannot update this todo.",
            update: "An error occurred while updating the todo.",

            // DELETE ERROR
            not_delete_auth_user: "Forbidden: You cannot delete this todo.",
            delete: "An error occurred while deleting the todo.",
        },
        folders: {
            // FETCH ERROR
            fetch: "An error occurred while fetching folders.",

            // CREATE ERROR
            create: "An error occurred while creating folder.",

            // UPDATE ERROR
            id_not_found: "Folder ID is required.",
            not_found: "Folder not found.",
            not_update_auth_user: "Forbidden: You cannot rename this folder.",
            update: "An error occurred while renaming the folder.",

            // DELETE ERROR
            not_delete_auth_user: "Forbidden: You cannot delete this folder.",
            delete: "An error occurred while deleting the folder.",
        },
        labels: {
            // FETCH ERROR
            fetch: "An error occurred while fetching labels.",

            // CREATE ERROR
            create: "An error occured while creating label.",

            // UPDATE ERROR
            id_not_found: "Label ID is required.",
            not_found: "Label not found.",
            not_update_auth_user: "Forbidden: You cannot rename this label.",
            update: "An error occurred while renaming the label.",

            // DELETE ERROR
            not_delete_auth_user: "Forbidden: You cannot delete this label.",
            delete: "An error occurred while deleting the label.",
        },
        remarks: {
            // FETCH ERROR
            fetch: "An error occurred while fetching remarks.",

            // CREATE ERROR
            create: "An error occured while creating remark.",

            // UPDATE ERROR
            id_not_found: "Remark ID is required.",
            not_found: "Remark not found.",
            not_update_auth_user: "Forbidden: You cannot rename this remark.",
            update: "An error occurred while renaming the remark.",

            // DELETE ERROR
            not_delete_auth_user: "Forbidden: You cannot delete this remark.",
            delete: "An error occurred while deleting the remark.",
        },
        dailyGoals: {
            // FETCH ERROR
            fetch: "An error occurred while fetching Daily Goals.",

            // CREATE ERROR
            create: "An error occured while creating Daily Goal.",

            // UPDATE ERROR
            id_not_found: "Daily Goal ID is required.",
            not_found: "Daily Goal not found.",
            not_update_auth_user: "Forbidden: You cannot update this Daily Goal.",
            update: "An error occurred while updating the Daily Goal.",

            // DELETE ERROR
            not_delete_auth_user: "Forbidden: You cannot delete this Daily Goal.",
            delete: "An error occurred while deleting the Daily Goals.",
        }
    },
    warning: {
        username: {
            taken: "Username is already taken.",
        },
        notes: {
            validation: "Either title or description must be provided.",
            zero: "No Notes found. Try creating a new one.",
        },
        todos: {
            validation: "Validation Failed for Todo.",
            zero: "No todos found for the selected date. Try creating a new one.",
        },
        folders: {
            validation: "Folder name is required.",
            name_taken: "Folder name must be unique.",
            minlength: "Folder name must have at least 1 character",
            maxLength: "Folder name must be at most 20 characters."
        },
        labels: {
            validation: "Label name is required.",
            unique: "Label name must be unique",
            zero: "No Labels Found. Try adding a new one.",
        },
        remarks: {
            validation: "Remark cannot be empty.",
            zero: "No remarks for the selected date. Try adding a new one.",
            minlength: "Remark must have at least 10 character",
            maxLength: "Reamrk must be at most 200 characters.",
        },
        date: {
            param: "Date parameter is required",
            invalid: "The provided date is invalid. Please check your date format.",
        },
        dailyGoals: {
            validation: "Validation failed for DailyGoal.",
            zero: "No daily goals found for the selected date. Try creating a new one.",
            targetHours: "Hours must be between 0 and 24",
            targetMinutes: "Minutes must be between 0 and 60",
        }
    },
};
