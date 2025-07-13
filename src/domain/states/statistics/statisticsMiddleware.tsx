import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setStatistics,
  setStatisticsError,
  syncStatisticsTrigger,
} from "./statisticsSlice";
import { syncStatisticsCore } from "../../usecase/useSyncStatistics";
import type { Middleware } from "@reduxjs/toolkit";
import { getUid } from "../../util/getUid";

//need to check if its ok to observe the uid from here (I belive not so much need to check how to solve)
//declarteely get isoulated this with the state(can pull form local strogae but less reliabel)

export const syncStatisticsThunk = createAsyncThunk<
  void,
  string | null // the UID (nullable)
>("statistics/syncStatistics", async (authUid, { dispatch }) => {
  console.log("tjh",authUid)
  const { data, error } = await syncStatisticsCore(authUid ?? ""); // handle fallback here
  if (error) {
    dispatch(setStatisticsError());
  } else if (data) {
    dispatch(setStatistics(data));
  }
});



export const statisticsMiddleware: Middleware =
  (store) => (next) => (action) => {
    const state = store.getState();
    const authUid: string | null = getUid(state.auth);

    if (syncStatisticsTrigger.match(action)) {
      store.dispatch(syncStatisticsThunk(authUid) as any); // optional: cast if needed
    }

    return next(action);
  };