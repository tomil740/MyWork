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

export function toDateOnlyISOString(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();
//I had a bug deeffault time set to 3 am and with the time zone to iso we get missed the last day as it should be bofre...
  // Create a new Date in UTC at midnight
  const utcDate = new Date(Date.UTC(year, month, day, 14, 0, 0));

  return utcDate.toISOString(); // will always return 'YYYY-MM-DDT00:00:00.000Z'
}

export function isSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}