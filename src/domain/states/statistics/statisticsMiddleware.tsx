import { createAsyncThunk } from "@reduxjs/toolkit";
import { setStatistics, setStatisticsError, syncStatisticsTrigger } from "./statisticsSlice";
import { syncStatisticsCore} from '../../usecase/useSyncStatistics';
import type { Middleware } from "@reduxjs/toolkit";

export const syncStatisticsThunk = createAsyncThunk(
  "statistics/syncStatistics",
  async (_, { dispatch }) => {
    const { data, error } = await syncStatisticsCore();
    if (error) {
      dispatch(setStatisticsError());
    } else if (data) {
        console.log("call to set ");
      dispatch(setStatistics(data));
    } 
  }
);

export const statisticsMiddleware: Middleware =
  (store) => (next) => (action) => {
    if (syncStatisticsTrigger.match(action)) {
      store.dispatch<any>(syncStatisticsThunk());
    }

    return next(action);
  };