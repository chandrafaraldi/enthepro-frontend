import { NavLink, useNavigate } from "react-router-dom";
import { 
  MdDashboard, 
  MdExplore, 
  MdNotificationsActive, 
  MdChat, 
  MdBookmarks, 
  MdAutoGraph, 
  MdAccountCircle, 
  MdSettings,
  MdLogout,
  MdAddCircle,
  MdFeed,
  MdAdminPanelSettings
} from "react-icons/md";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="sidebar shadow-sm">
      <div className="sidebar-logo">
        <NavLink to="/home" className="text-decoration-none">
           SysMedia
        </NavLink>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/home" className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}>
          <MdFeed className="icon" />
          <span className="sidebar-text">Feed</span>
        </NavLink>

        <NavLink to="/search" className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}>
          <MdExplore className="icon" />
          <span className="sidebar-text">Jelajahi</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}>
          <MdAccountCircle className="icon" />
          <span className="sidebar-text">Profil Saya</span>
        </NavLink>

        {user.is_admin && (
          <NavLink to="/admin" className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}>
            <MdAdminPanelSettings className="icon text-warning" />
            <span className="sidebar-text">Admin Panel</span>
          </NavLink>
        )}
      </nav>
      {/* Profile/Logout Mini Section at Bottom */}
      <div className="mt-auto pb-4">
        <button
          onClick={handleLogout}
          className="nav-link-item text-danger border-0 bg-transparent w-100 text-start premium-logout"
        >
          <MdLogout className="icon" />
          <span className="sidebar-text fw-bold">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
