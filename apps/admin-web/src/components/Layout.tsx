import { Outlet, useLocation, useNavigate } from "react-router-dom";
import BottomNavbar from "./BottomNavbar";
import Sidebar from "./Sidebar";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useEventToast } from "../hooks/useEventToast";
import { useEffect, useState } from "react";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, checkAuth } = useAuth();

  const isLogin = location.pathname === "/login";
  
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const { toastMessage, clearToast } = useEventToast(apiUrl);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      setActiveToast(toastMessage.text);
      const timer = setTimeout(() => {
        setActiveToast(null);
        clearToast();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [toastMessage]);
  

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
            Absenin Admin
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

        {activeToast && (
          <div className="fixed top-16 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 animate-slide-in font-sans text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div className="flex flex-col">
              <span className="font-bold text-slate-200">Notifikasi</span>
              <span className="text-slate-300">{activeToast}</span>
            </div>
            <button
              onClick={() => setActiveToast(null)}
              className="ml-2 text-slate-400 hover:text-white text-sm"
            >
              &times;
            </button>
          </div>
        )}
      </div>

      {!isLogin && <BottomNavbar />}
    </div>
  );
}