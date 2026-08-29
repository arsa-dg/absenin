import { NavLink } from "react-router-dom";

export interface NavItem {
  to: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: "/summary",
    label: "Summary",
  },
  {
    to: "/attendance",
    label: "Attendance",
  },
  {
    to: "/profile",
    label: "Profile",
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden sticky top-0 h-screen w-60 lg:flex flex-col shrink-0 bg-white border-r border-slate-200/80 p-5 select-none">
      <div className="flex items-center gap-2.5 px-3 py-2 mb-6">
        <div className="w-7 h-7 rounded-md bg-black flex items-center justify-center text-white font-mono font-bold text-xs">
          A
        </div>
        <span className="font-extrabold text-slate-900 tracking-tight text-base font-sans">
          Absenin
        </span>
      </div>

      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `px-3.5 py-2.5 rounded-lg font-sans text-xs transition-all duration-150 ${
                isActive
                  ? "bg-slate-900 text-white font-semibold shadow-xs"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-medium"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
