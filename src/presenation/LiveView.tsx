import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { getWeekRange } from "../domain/util/getCurrentWeekRange";
import WeekSummary from "./components/WeekSummary";
import DailyPresentation from "./components/DailyPresentation";
import styles from "./style/LiveView.module.css";
import { getWeekSum } from "../domain/util/getWeekSum";
import type { DailyDeclare } from "../domain/models/DailyDeclare";
import { useGetWeekDeclarations } from "../domain/usecase/useGetWeekDeclaries";
import { useUpsertDeclare } from "../domain/usecase/useUpsertDeclare";
import { LiveWeekState } from "../domain/states/LiveWeek";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import { useParams } from "react-router-dom";
import { castToDate } from "../domain/util/DateUtils";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../domain/states/Store";
import { getUid } from "../domain/util/getUid";

export default function LiveView() {
  const statistics = useSelector((s: RootState) => s.statistics.average);
  const dispatch = useDispatch();

  const [dailyDeclares, setDailyDeclares] = useRecoilState(LiveWeekState);

  const authUser = useSelector((state: RootState) => state.auth);

  const { WeekDate } = useParams<{ WeekDate: string }>();

  const didInitRef = useRef(false);

  const { loadWeekData, loading, error } = useGetWeekDeclarations();

  //those are the ui observed ui states to all the process around
  const uiErrorState = useState<Error | null>(null);
  const uiLoadingState = useState(false);

  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
      let theDate = new Date();
      if (WeekDate != null) {
        theDate = castToDate(WeekDate);
      } else {
        uiErrorState[1](
          Error("No week value has been pass, init current week")
        );
      }

      const theWeekRange = getWeekRange(theDate);
      const a = loadWeekData(
        theWeekRange.start,
        theWeekRange.end,
        getUid(authUser) ?? ""
      );
      a.then((ele) => {
        if (ele != null) {
          setDailyDeclares(ele);
        }
      });

      if(!statistics){
        dispatch({ type: "SyncStatistics" });
      }

    }
  }, []);

  const {
    upsertDeclare,
    loading: saving,
    error: saveError,
    success,
  } = useUpsertDeclare();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });

  useEffect(() => {
    //will handle the logic to union all the process states into one ui observed state
    uiErrorState[1](error);
    uiLoadingState[1](loading);
  }, [error, loading]);

  useEffect(() => {
    if (error != null) {
      setSnackbar({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  }, [uiErrorState]);

  // Handle save success/failure feedback
  useEffect(() => {
    if (success) {
      setSnackbar({
        open: true,
        message: "Updated successfully",
        type: "success",
      });
    } else if (saveError) {
      setSnackbar({ open: true, message: "Update failed", type: "error" });
    }
  }, [success, saveError]);

  // Update handler
  const handleUpdate = (updated: DailyDeclare) => {
    upsertDeclare(updated, getUid(authUser) ?? "");
    //Optionally: update local recoil immediately (optimistic)
    setDailyDeclares((prev: DailyDeclare[]) =>
      prev.map((d) => (d.date === updated.date ? updated : d))
    );
  };

  return (
    <div className={styles.container}>
      {(loading || saving) && (
        <div className="loading-overlay">
          <CircularProgress />
        </div>
      )}

      {snackbar.open && (
        <Snackbar
          open={snackbar.open}
          message={snackbar.message}
          autoHideDuration={3000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          className={`snackbar-${snackbar.type}`}
        />
      )}

      <WeekSummary stats={getWeekSum(new Date(), dailyDeclares || [])} />

      <div className={styles.dailyList}>
        {dailyDeclares?.map((ele: DailyDeclare) => (
          <DailyPresentation
            daily={ele}
            onUpdate={handleUpdate}
            editable={true}
            statVerage={statistics ? statistics.averagePerDay : -1}
            key={ele.date}
          />
        ))}
      </div>
    </div>
  );
}
