import {
  getWeekDeclarations,
  getDeclarationsUntil,
} from "../../data/remote/DeclariesRemoteDao";
import { getCurrentWeekRange } from "../util/getCurrentWeekRange";
import type { FinalStatistics } from "../models/FinalStatistics";
import {
  loadArchiveStat,
  saveArchiveStat,
} from "../../data/local/loadArchiveStat";
import type { ArchiveStat } from "../models/ArchiveStat";
import { FIXED_UID } from "../../data/firebaseConfig";
import type { DailyDeclare } from "../models/DailyDeclare";
import { subDays } from "date-fns";
import { castToDate, isSameDate, toDateOnlyISOString } from "../util/DateUtils";

export async function syncStatisticsCore(): Promise<{
  data?: FinalStatistics;
  error?: string;
}> {
  try {
    const CurrentWeekRange = getCurrentWeekRange();
    // 1. Load archive stat from local storage
    const archiveStat = loadArchiveStat();

    let validArchive: ArchiveStat | null = null;
    const currentWeekStart = CurrentWeekRange.start;

    // 2. Check if archiveStat is valid
    //* sync archive should be until the end of the last week to the current which menas calcualte until satuerday
    //to be set when synced
  
    if (
      archiveStat &&
      isSameDate(new Date(archiveStat.untilDate), subDays(currentWeekStart, 1))
    ) {
      validArchive = archiveStat;
      console.log("init regular , sync current week");

    }

    //update the until date time to get all data of the date
    const a = castToDate(toDateOnlyISOString(currentWeekStart));
    // 3. If not valid, recalculate and cache
    if (!validArchive) {
      console.log("Archive stat full calcualtion")
      const untilDate = subDays(a, 1);
      const archiveDeclarations = await getDeclarationsUntil(
        untilDate,
        FIXED_UID
      );
      console.log(archiveDeclarations)
      //get the first declare date
      const firstDecalreDate =
        archiveDeclarations.length - 1 > 0
          ? toDateOnlyISOString(
              castToDate(
                archiveDeclarations[archiveDeclarations.length - 1].date
              )
            )
          : toDateOnlyISOString(untilDate);


      const untilDateStr = toDateOnlyISOString(untilDate);

      const calculatedArchive: ArchiveStat = {
        untilDate: untilDateStr,
        startDate: firstDecalreDate,
        declarationDates: archiveDeclarations.length,
        daySum: archiveDeclarations.reduce(
          (sum: number, d: DailyDeclare) => sum + (d.general + d.work),
          0
        ),
        general: archiveDeclarations.reduce(
          (sum: number, d: DailyDeclare) => sum + d.general,
          0
        ),
        work: archiveDeclarations.reduce(
          (sum: number, d: DailyDeclare) => sum + d.work,
          0
        ),
      };

      saveArchiveStat(calculatedArchive);
      validArchive = calculatedArchive;
    }

    // 4. Pull current week declarations
    const currentWeek = CurrentWeekRange;
    const currentWeekDeclarations = await getWeekDeclarations(
      currentWeek.start,
      currentWeek.end,
      FIXED_UID
    );

    const currentSum = currentWeekDeclarations.reduce(
      (sum, d) => sum + (d.general + d.work),
      0
    );
    const currentDays = currentWeekDeclarations.length;

    // 5. Combine both
    const totalSum = validArchive.daySum + currentSum;
    const totalWorkDays = validArchive.declarationDates + currentDays;


    const fullDayCount = calculateDateDiff(
      validArchive.startDate,
      currentWeek.end
    );


    const final: FinalStatistics = {
      averagePerDay: totalSum / fullDayCount,
      averagePerWorkDay: totalWorkDays > 0 ? totalSum / totalWorkDays : 0,
    };

    return { data: final };
  } catch (err: any) {
    console.error("SyncStatistics error:", err);
    return { error: "Failed to sync statistics." };
  }
}

function calculateDateDiff(startIso: string, end: Date): number {
  const start = new Date(startIso);
  const diffMs = end.getTime() - start.getTime();
  return Math.max(Math.ceil(diffMs / (1000 * 60 * 60 * 24)), 1); // at least 1 day
}
