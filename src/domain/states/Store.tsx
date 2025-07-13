import { configureStore } from "@reduxjs/toolkit";
import statisticsReducer from "./statistics/statisticsSlice";
import { statisticsMiddleware } from "./statistics/statisticsMiddleware";
import authReducer from "../states/AuthState/AuthSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    statistics: statisticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(statisticsMiddleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

 