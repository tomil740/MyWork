import { Outlet } from "react-router-dom";
import ThemeToggleBut from "../theme/ThemeToggleBut";
import TopBar from "../../presenation/components/TopBar";

const RootLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
