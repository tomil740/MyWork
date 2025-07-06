import { createBrowserRouter } from "react-router-dom";
import LiveView from "../../presenation/LiveView";
import { WeekSumView } from "../../presenation/WeekSumView";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <WeekSumView />,
      },
    ],
  },
]);
