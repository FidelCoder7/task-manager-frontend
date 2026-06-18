/**
 * Global authentication state.
 *
 * Responsibilities:
 *  - Holds the current user (with role) and tokens
 *  - On app load, checks localStorage for an existing token and
 *    re-fetches the user profile (so refreshing the page doesn't
 *    log the user out)
 *  - Exposes login(), register(), logout()
 */

import { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginUser, logoutUser, registerUser } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking existing session

  // On first load, if a token exists, try to restore the session
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((profile) => setUser(profile))
      .catch(() => {
        // Token invalid/expired — clear it
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const tokens = await loginUser(email, password);
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);

    const profile = await getMe();
    setUser(profile);
  }

  async function register(email, username, password) {
    await registerUser(email, username, password);
    // Registration does not log the user in automatically —
    // they're redirected to the login page (see RegisterPage)
  }

  async function logout() {
    const refreshToken = localStorage.getItem("refresh_token");
    try {
      if (refreshToken) await logoutUser(refreshToken);
    } catch {
      // Even if the backend call fails, clear local state —
      // logout should always succeed from the user's perspective
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
