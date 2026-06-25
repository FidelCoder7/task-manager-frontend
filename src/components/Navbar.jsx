import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const dashClass = "nav-link" + (location.pathname === "/dashboard" ? " nav-link-active" : "");
  const adminClass = "nav-link" + (location.pathname === "/admin" ? " nav-link-active" : "");

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        TaskManager
      </div>

      <div className="navbar-links">
        <a href="/dashboard" className={dashClass}>
          My Tasks
        </a>
        {isAdmin && (
          <a href="/admin" className={adminClass}>
            Admin Panel
          </a>
        )}
      </div>

      <div className="navbar-user">
        <span className="navbar-username">{user?.username}</span>
        {isAdmin && <span className="badge role-admin">admin</span>}
        <button className="btn-logout" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
