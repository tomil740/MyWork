import type { DailyDeclare } from "../models/DailyDeclare";

export  function createEmptyDeclare(date: string): DailyDeclare {
  return {
    date,
    general: 0,
    work: 0,
  };
}
