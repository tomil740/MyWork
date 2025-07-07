import { startOfWeek, endOfWeek, subWeeks } from "date-fns";
import type { WeeksRange } from "../models/WeeksRange";

export function getCurrentWeekRange(): { start: Date; end: Date } {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 0 }); // Sunday
  const end = today
  return { start, end };
}

export function getWeekRange(weekDate:Date): { start: Date; end: Date } {
  const today = weekDate;
  const start = startOfWeek(today, { weekStartsOn: 0 }); // Sunday
  const end = endOfWeek(today, { weekStartsOn: 0 }); // Saturday
  return { start, end };
}

export function getPageWeekRange(weekDate: Date): { start: Date; end: Date } {


  const pageWeeks = 5;
  //get the current last week
  const firstWeek = getWeekRange(weekDate);

  const end = firstWeek.end;
  const theStart = subWeeks(firstWeek.start, pageWeeks);
  //validate its satuerday
  const start = startOfWeek(theStart, { weekStartsOn: 0 }); // Sunday


  return { start, end };
}
export function isDateInRange(date: Date, range: WeeksRange): boolean {
  return date >= range.start && date <= range.end;
}