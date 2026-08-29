import { Outlet, useLocation, useNavigate } from "react-router-dom";
import BottomNavbar from "./BottomNavbar";
import Sidebar from "./Sidebar";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();

  const location = useLocation();
  const isLogin = location.pathname === "/login";

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      await checkAuth();
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {!isLogin && <Sidebar />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between lg:justify-end sticky top-0 z-40">
          <span className="font-extrabold text-slate-900 tracking-tight text-sm font-sans lg:hidden">
            Absenin
          </span>

          {!isLogin && <div className="flex items-center gap-4">
            {user && (
              <span className="hidden sm:inline font-sans text-xs font-semibold text-slate-700">
                {user.name}
              </span>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-sans font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>}
        </header>

        <main className="flex-1 p-4 pb-24 lg:pb-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {!isLogin && <BottomNavbar />}
    </div>
  );
}