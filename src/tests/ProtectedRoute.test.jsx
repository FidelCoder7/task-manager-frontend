import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import * as AuthContext from "../context/AuthContext";

function renderProtected(authValue) {
  vi.spyOn(AuthContext, "useAuth").mockReturnValue(authValue);
  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  it("renders children when authenticated", () => {
    renderProtected({ isAuthenticated: true, loading: false });
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to login when not authenticated", () => {
    renderProtected({ isAuthenticated: false, loading: false });
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders nothing while loading", () => {
    renderProtected({ isAuthenticated: false, loading: true });
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });
});
