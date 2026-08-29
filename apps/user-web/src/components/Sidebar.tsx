import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="hidden sticky top-0 h-screen w-64 lg:flex flex-col shrink-0 p-5 px-10 border-r">
      <nav className="flex-1 flex flex-col gap-3 overflow-y-auto">
        <NavLink to="/summary">Summary</NavLink>
        <NavLink to="/attendance">Attendance</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>
    </aside>
  );
}
