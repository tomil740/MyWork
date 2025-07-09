import { getWeekRange } from "./getCurrentWeekRange";
import type { DailyDeclare } from "../models/DailyDeclare";
import type { WeekStats } from "../models/WeekStats";
import { castToDate } from "./DateUtils";
import type { WeeksRange } from "../models/WeeksRange";

export function getWeeksSum(
  dailyDeclareList: DailyDeclare[],
  theWeekRange: WeeksRange
): WeekStats[] {
  const weekStatsCollection: WeekStats[] = [];

  const weekRange = {
    start: new Date(theWeekRange.start),
    end: new Date(theWeekRange.end),
  };

  // Helper function to map dates in the range into weekly periods
  const getWeeksInRange = (startDate: Date, endDate: Date) => {
    const weeks: Date[] = [];
    let currentDate = startDate;

    // Loop through and get each week's starting date (every 7 days)
    while (currentDate < endDate) {
      weeks.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 7); // Move to next week
    }

    return weeks;
  };

  // Get all the start dates for the weeks in the range
  const weeksInRange = getWeeksInRange(weekRange.start, weekRange.end);

  // Loop through each week in the range and summarize the daily data
  weeksInRange.forEach((weekStart) => {
    const { start, end } = getWeekRange(weekStart);

    // Filter dailyDeclareList to match dates in the current week range
    const matchedData = dailyDeclareList.filter(
      (declare) =>
        castToDate(declare.date) >= start && castToDate(declare.date) <= end
    );

    const newObj = {
      weekStart: start.toISOString(),
      weekSum: 0,
      averagePerDay: 0,
    };
    if (matchedData.length > 0) {
      const weekSum = matchedData.reduce(
        (total, current) => total + current.general + current.work,
        0
      );
      const averagePerDay = weekSum / matchedData.length;

      const a = Number(weekSum.toFixed(2));
      const b = Number(averagePerDay.toFixed(2));

      weekStatsCollection.push({
        weekStart: start.toISOString(),
        weekSum: a,
        averagePerDay: b,
      });
    } else {
      weekStatsCollection.push(newObj);
    }
  });

  return weekStatsCollection.reverse();
}
