import { configureStore } from "@reduxjs/toolkit";
import statisticsReducer from "./statistics/statisticsSlice";
import { statisticsMiddleware } from "./statistics/statisticsMiddleware";

export const store = configureStore({
  reducer: {
    statistics: statisticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(statisticsMiddleware),
});
export type RootState = ReturnType<typeof store.getState>;
 