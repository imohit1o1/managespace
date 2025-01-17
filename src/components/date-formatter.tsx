import { format } from "date-fns";

/**
 * Formats a given date into a specific string format.
 * @param date - The date to format. Can be a Date object or a string.
 * @param formatType - Specifies the type of date format.
 *                     "NumberFormatDate" for yyyy-MM-dd
 *                     "WordFormatDate" for Monthname-day, year
 * @returns A formatted date string.
 */
export function FormatDate(
  date: Date | string,
  formatType: "NumberFormatDate" | "WordFormatDate"
): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  switch (formatType) {
    case "NumberFormatDate":
      return format(parsedDate, "yyyy-MM-dd"); // Example: 2025-01-17
    case "WordFormatDate":
      return format(parsedDate, "MMMM dd, yyyy"); // Example: January-17, 2025
    default:
      throw new Error(
        "Invalid format type. Use 'NumberFormatDate' or 'WordFormatDate'."
      );
  }
}
