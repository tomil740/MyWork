/*
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import CircularProgress from "@mui/material/CircularProgress"; // or your design system
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { usePaginatedDeclarations } from "../domain/usecase/usePaginatedDeclarations";
import { WeeksSums } from "../domain/states/LiveWeek";
import type { WeekStats } from "../domain/models/WeekStats";
import type { DailyDeclare } from "../domain/models/DailyDeclare";
import { getFiveWeekRange } from "../domain/util/getCurrentWeekRange";
import { subWeeks , addWeeks} from "date-fns";
import { castToDate } from "../domain/util/castToDate";
import { getWeekSums } from "../domain/util/getWeekSums";

export function AllTimeView() {
  const weekSums1 = useState([]);
  const weekSums: WeekStats[] = weekSums1[0];
  const setWeekSum = weekSums1[1];
  const { page, loadNextPage, loading, error, hasMore } =
    usePaginatedDeclarations();
  const [allDeclarations, setAllDeclarations] = useState<DailyDeclare[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const lastWeekStart = weekSums[weekSums.length - 1]?.weekStart;

  const currentIndex =
    lastWeekStart && !isNaN(Date.parse(lastWeekStart))
      ? castToDate(lastWeekStart)
      : new Date();

  const [fetchUntilWeek, setFetchUntilWeek] = useState<Date>(currentIndex);

  const observer = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (page.length === 0) return;

    setAllDeclarations((prev) => {
      const combined = [...prev, ...page];

      // Only process the new page to avoid reprocessing old data
      console.log("page", page);
      const newWeekSums = getWeekSums(page);
      setWeekSum((prevWeekSums: WeekStats[]) => {
        const existingStarts = new Set(prevWeekSums.map((w) => w.weekStart));
        const filteredNew = newWeekSums.filter(
          (w) => !existingStarts.has(w.weekStart)
        );
        return [...prevWeekSums, ...filteredNew];
      });

      return combined;
    });
  }, [page]);

  // Trigger pagination scroll
  // Trigger pagination scroll + retry on error
  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    const tryLoadNext = () => {
      if (hasMore) {
        const a = getFiveWeekRange(fetchUntilWeek);
        setFetchUntilWeek(subWeeks(a.start, 1));
        loadNextPage(a.start, a.end);
      } else {
      }
    };

    // Retry logic on error
    if (error) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 30000); // cap at 30s

      retryTimeoutRef.current = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        tryLoadNext();
      }, delay);

      return () => {
        if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      };
    } else {
      // Reset retry count when error is cleared
      if (retryCount !== 0) {
        setRetryCount(0);
      }

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            tryLoadNext();
          }
        },
        { rootMargin: "100px" }
      );

      if (bottomRef.current) {
        observer.current.observe(bottomRef.current);
      }
    }

    // Cleanup on unmount
    return () => {
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore, loadNextPage, fetchUntilWeek, error, retryCount]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Weekly Summary View
      </Typography>

      {weekSums.length === 0 && loading && (
        <Box textAlign="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" textAlign="center" mt={2}>
          Failed to load data: {error.message}
        </Typography>
      )}

      {weekSums.map((week: WeekStats) => (
        <Box
          key={week.weekStart}
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            padding: 2,
            marginBottom: 2,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="subtitle1">
            Week of {new Date(week.weekStart).toLocaleDateString()}
          </Typography>
          <Typography>Total: {week.weekSum}</Typography>
          <Typography>Average per Day: {week.averagePerDay}</Typography>
        </Box>
      ))}

      {loading && (
        <Box textAlign="center" py={2}>
          <CircularProgress size={24} />
        </Box>
      )}

      <div ref={bottomRef} />
    </Box>
  );
}

*/