import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./Sidebar";

export default function BottomNavbar() {
  return (
    <nav className="lg:hidden fixed bottom-3 inset-x-3 z-50 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-lg shadow-slate-900/5 p-1.5 flex justify-around items-center gap-1.5">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center justify-center flex-1 py-2.5 px-2 rounded-lg text-xs font-sans transition-all duration-150 select-none ${
              isActive
                ? "bg-slate-900 text-white font-semibold shadow-xs"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-medium"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}