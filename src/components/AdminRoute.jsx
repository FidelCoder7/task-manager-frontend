/**
 * Wraps any route that requires the admin role.
 * Redirects non-admins to /dashboard (they're authenticated,
 * just not authorized — mirrors the backend's 403 semantics).
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return children;
}

export default AdminRoute;