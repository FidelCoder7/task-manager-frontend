/**
 * Wraps any route that requires authentication.
 * Redirects to /login if not authenticated.
 * Shows nothing while the initial session check is in progress
 * (prevents a flash of redirect before AuthContext finishes loading).
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;