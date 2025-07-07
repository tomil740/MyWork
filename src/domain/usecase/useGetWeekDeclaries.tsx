import { useCallback, useState } from "react";
import { formatISO, addDays, isBefore,startOfDay, isAfter } from "date-fns";
import { getWeekDeclarations } from "../../data/remote/DeclariesRemoteDao";
import type { DailyDeclare } from "../models/DailyDeclare";
import { createEmptyDeclare } from "../util/createEmptyDeclare";
import { FIXED_UID } from "../../data/firebaseConfig";
import { castToDate } from "../util/castToDate";


export function useGetWeekDeclarations() { 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadWeekData = useCallback(async (start: Date, end: Date) => {
    if(isAfter(end,(new Date()))){
      end = new Date()
    };
    setLoading(true);
    setError(null);
    try {
      const serverList = await getWeekDeclarations(start, end, FIXED_UID);
      const sorted = serverList.sort(
        (a, b) => castToDate(a.date).getTime() - castToDate(b.date).getTime()
      );

      const resultList: DailyDeclare[] = [];
      let current = start;

      for (const item of sorted) {
        const itemDate = castToDate(item.date);
        while (isBefore(startOfDay(current), startOfDay(itemDate))) {
          resultList.push(
            createEmptyDeclare(formatISO(current, { representation: "date" }))
          );
          current = addDays(current, 1);
        }
        resultList.push({
          date: formatISO(itemDate, { representation: "date" }),
          general: item.general,
          work: item.work,
        });
        current = addDays(itemDate, 1);
      }

      while (!isAfter(current, end)) {
        resultList.push(
          createEmptyDeclare(formatISO(current, { representation: "date" }))
        );
        current = addDays(current, 1);
      }

      return(resultList.reverse());
    } catch (e) {
      setError(e as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loadWeekData, loading, error };
}
