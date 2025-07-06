import { parseISO, isValid } from "date-fns";

export function castToDate(input: unknown): Date {
  if (!input) {
    throw new Error("Invalid date: value is null or undefined");
  }

  // Handle Firestore Timestamp
  if (
    typeof input === "object" &&
    input !== null &&
    typeof (input as any).toDate === "function"
  ) {
    const date = (input as any).toDate();
    if (!isValid(date)) throw new Error("Invalid Firestore Timestamp");
    return date;
  }

  // Handle ISO string
  if (typeof input === "string") {
    const date = parseISO(input);
    if (!isValid(date)) throw new Error(`Invalid ISO date string: ${input}`);
    return date;
  }

  throw new Error("Unsupported date format");
}
