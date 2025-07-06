import { useEffect, useState } from "react";
import { formatISO, addDays, isBefore,startOfDay, isAfter } from "date-fns";
import { getWeekDeclarations } from "../../data/remote/DeclariesRemoteDao";
import type { DailyDeclare } from "../models/DailyDeclare";
import { createEmptyDeclare } from "../util/createEmptyDeclare";
import { FIXED_UID } from "../../data/firebaseConfig";
import { castToDate } from "../util/castToDate";


export function useGetLiveViewDeclaries(start: Date, end: Date) {
  const [data, setData] = useState<DailyDeclare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadWeekDeclaries() {
      setLoading(true);
      setError(null);

      try {
        const serverList = await getWeekDeclarations(start, end, FIXED_UID);

        // Sort server list by date, using `castToDate`
        const sorted = serverList
          .slice()
          .sort(
            (a, b) =>
              castToDate(a.date).getTime() - castToDate(b.date).getTime()
          );

        const resultList: DailyDeclare[] = [];
        let current = start;

        for (const item of sorted) {
          const itemDate = castToDate(item.date); // Use the cast function

          
        while (isBefore(startOfDay(current), startOfDay(itemDate))) {
          resultList.push(
            createEmptyDeclare(formatISO(current, { representation: "date" }))
          );
          current = addDays(current, 1);
        }
          // Push actual item
          resultList.push({
            date: formatISO(itemDate, { representation: "date" }),
            general: item.general,
            work: item.work,
          });

          current = addDays(itemDate, 1); // Move to the next day
        }

        // Fill any remaining placeholders till `end`
        while (!isAfter(current, end)) {
          resultList.push(
            createEmptyDeclare(formatISO(current, { representation: "date" }))
          );
          current = addDays(current, 1);
        }

        if (!cancelled) {
          setData(resultList.reverse());
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.log("fail", err);
          setError(err as Error);
          setLoading(false);
        }
      }
    }

    loadWeekDeclaries();

    return () => {
      cancelled = true;
      setLoading(false);
    };
  }, [start, end]);

  return { data, loading, error };
}
