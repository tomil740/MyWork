import { useCallback, useEffect, useRef, useState } from "react";
import type { WeekStats } from "../domain/models/WeekStats";
import { usePaginatedDeclarations } from "../domain/usecase/usePaginatedDeclarations";
import { getPageWeekRange } from "../domain/util/getCurrentWeekRange";
import { CircularProgress, Snackbar } from "@mui/material";
import { getWeeksSum } from "../domain/util/getWeekSums";
import { subDays } from "date-fns";
import styles from "./style/LiveView.module.css";
import type { DailyDeclare } from "../domain/models/DailyDeclare";
import WeekSummary from "./components/WeekSummary";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../domain/states/Store"; 
import UnauthorizedReportsMessage from "./components/UnauthorizedReportsMessage";
import { getUid } from "../domain/util/getUid";

export function WeekSumView() {
  const statistics = useSelector((s: RootState) => s.statistics.average);
  const dispatch = useDispatch();

  //pagination use case
  const pageWeekRangeRef = useRef(getPageWeekRange(new Date()));

  const authUser = useSelector((state: RootState) => state.auth);

  //pagiantion hock,bascily call back and its process states
  const { loadNextPage, loading, error, hasMore } = usePaginatedDeclarations();

  //the presesntaion level data
  const [theData, setTheData] = useState<WeekStats[]>([]);

  const didInitRef = useRef(false);

  //sncak bar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });

  //those are the ui observed ui states to all the process around
  const uiErrorState = useState<Error | null>(null);
  const uiLoadingState = useState(false);

  useEffect(() => {
    //will handle the logic to union all the process states into one ui observed state
    uiErrorState[1](error);
    uiLoadingState[1](loading);
    if (!hasMore) {
      setSnackbar({
        open: true,
        message: "End of server data , load place holder to push on demand",
        type: "info",
      });
    }
  }, [hasMore, error, loading]);

  useEffect(() => {
    if (error != null) {
      setSnackbar({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  }, [uiErrorState]);

  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
      getNextPage();
    }

    // Trigger statistics sync if needed
    if (!statistics) {
      dispatch({ type: "SyncStatistics" });
    }
  }, []);

  const getNextPage = useCallback(async () => {
    const currentRange = pageWeekRangeRef.current;

    const res = await loadNextPage(currentRange, getUid(authUser) ?? "");
    let theRes: DailyDeclare[] = [];
    if (res != null) {
      theRes = res;
    }
    const a = getWeeksSum(theRes, currentRange);

    setTheData((prev) => prev.concat(a));

    pageWeekRangeRef.current = getPageWeekRange(subDays(currentRange.start, 3));
  }, []);

  return (
    <div className={styles.container}>
      {authUser === null ? (
        <UnauthorizedReportsMessage />
      ) : (
        <>
          {statistics ? (
            <WeekSummary
              stats={{
                weekStart: new Date().toISOString(),
                weekSum: Number(statistics.averagePerWorkDay.toFixed(2)),
                averagePerDay: Number(
                  (statistics.averagePerDay * 7).toFixed(2)
                ),
              }}
              isHeader={true}
            />
          ) : (
            <h2>statistics error...</h2>
          )}

          {uiLoadingState[0] && (
            <div className="loading-overlay">
              <CircularProgress />
            </div>
          )}

          {snackbar.open && (
            <Snackbar
              open={snackbar.open}
              message={snackbar.message}
              autoHideDuration={1500}
              onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              className={`snackbar-${snackbar.type}`}
            />
          )}

          {theData.map((week: WeekStats, index) => (
            <WeekSummary stats={week} key={week.weekStart + index} />
          ))}

          <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={getNextPage}>
              Get More...
            </button>
          </div>
        </>
      )}
    </div>
  );

}
