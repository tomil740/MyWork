import { useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { getCurrentWeekRange } from "../domain/util/getCurrentWeekRange";
import WeekSummary from "./components/WeekSummary";
import DailyPresentation from "./components/DailyPresentation";
import styles from "./style/LiveView.module.css";
import { getWeekSum } from "../domain/util/getWeekSum";
import type { DailyDeclare } from "../domain/models/DailyDeclare";
import { useGetLiveViewDeclaries } from "../domain/usecase/useGetLiveViewDeclaries";
import { useUpsertDeclare } from "../domain/usecase/useUpsertDeclare";
import { LiveWeekState } from "../domain/states/LiveWeek";
import  CircularProgress  from '@mui/material/CircularProgress';
import  Snackbar  from '@mui/material/Snackbar';

export default function LiveView() {
  const [dailyDeclares, setDailyDeclares] = useRecoilState(LiveWeekState);

  const { start, end } = useMemo(() => getCurrentWeekRange(), []);

  const { data, loading, error } = useGetLiveViewDeclaries(start, end);

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

  // Sync server data to Recoil state once on success
  useEffect(() => {
    if (!data || data.length === 0) return;

    setDailyDeclares(data);
  }, [data]);
  
  

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
    upsertDeclare(updated);
      //Optionally: update local recoil immediately (optimistic)
     setDailyDeclares((prev:DailyDeclare[]) =>
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

      <WeekSummary stats={getWeekSum((new Date()),dailyDeclares || [] )} />

      <div className={styles.dailyList}>
        {dailyDeclares?.map((ele:DailyDeclare) => (
          <DailyPresentation
            daily={ele}
            onUpdate={handleUpdate}
            editable={true}
            key={ele.date}
          />
        ))}
      </div>
    </div>
  );
}
