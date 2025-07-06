import type { DailyDeclare } from "../models/DailyDeclare";
import type { WeekStats } from "../models/WeekStats";

export function getWeekSum(startDate:Date,dailyDeclares: DailyDeclare[]): WeekStats {


 
    const weekStartD = new Date(startDate);
 


  if (dailyDeclares.length === 0) {
    const weekStart = weekStartD.toISOString(); //new Date().toISOString();
    return {
      weekStart,
      weekSum: 0,
      averagePerDay: 0,
    };
  }

  const sorted = [...dailyDeclares].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const weekStart = sorted[0].date;

  const weekSum = dailyDeclares.reduce(
    (sum, item) => sum + item.work + item.general,
    0
  );

  const uniqueDays = new Set(
    dailyDeclares.map((d) => new Date(d.date).toDateString())
  ).size;

  const averagePerDay = uniqueDays > 0 ? weekSum / uniqueDays : 0;

  return {
    weekStart,
    weekSum: Number(weekSum.toFixed(2)),
    averagePerDay: Number(averagePerDay.toFixed(2)),
  };
}
