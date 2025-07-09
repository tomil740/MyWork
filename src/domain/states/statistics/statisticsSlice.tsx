import type { FinalStatistics } from "../../models/FinalStatistics";
import type { StatisticsState } from "../../models/StatisticsState";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createAction } from "@reduxjs/toolkit";


const initialState: StatisticsState = {
  syncedError: false,
  average: null,
};

export const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    setStatistics: (state, action: PayloadAction<FinalStatistics>) => {
      state.average = action.payload;
      state.syncedError = false;
    },
    setStatisticsError: (state) => { 
      state.syncedError = true;
      state.average = null;
    },
  },
});

export const { setStatistics, setStatisticsError } = statisticsSlice.actions;
export default statisticsSlice.reducer;

export const syncStatisticsTrigger = createAction("SyncStatistics");
