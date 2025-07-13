import { createBrowserRouter } from "react-router-dom";
import LiveView from "../../presenation/LiveView";
import { WeekSumView } from "../../presenation/WeekSumView";
import LoginPage from "../../presenation/LoginPage";
import RegisterPage from "../../presenation/RegisterPage";
import RootLayout from "./RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <WeekSumView />,
      },
      {
        path: "/LiveView",
        element: <LiveView />,
      },
      {
        path: "/LiveView/:WeekDate",
        element: <LiveView />,
      },

      {
        path: "/Login",
        element: <LoginPage />,
      },
      {
        path: "/Register",
        element: <RegisterPage />,
      },
    ],
  },
]);
