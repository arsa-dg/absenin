import { NavLink } from "react-router-dom";

export default function BottomNavbar() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center py-2 px-1 border-t">
      <NavLink to="/summary">Summary</NavLink>
      <NavLink to="/attendance">Attendance</NavLink>
      <NavLink to="/profile">Profile</NavLink>
    </nav>
  );
}