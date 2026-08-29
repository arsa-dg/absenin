import { Outlet, useLocation } from "react-router-dom";
import BottomNavbar from "./BottomNavbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {!isAuthPage && <BottomNavbar />}
      {!isAuthPage && <Sidebar />}

      <main className="max-w-4xl mx-auto px-4 py-8 w-full">
        <Outlet />
      </main>
    </div>
  );
}