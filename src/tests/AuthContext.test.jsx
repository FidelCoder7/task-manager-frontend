import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import * as authApi from "../api/authApi";

vi.mock("../api/authApi");

// Helper component — renders auth state so we can assert on it
function AuthDisplay() {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div>Loading</div>;
  return (
    <div>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="admin">{String(isAdmin)}</span>
      <span data-testid="username">{user?.username || "none"}</span>
    </div>
  );
}

function renderWithAuth(ui) {
  return render(<AuthProvider>{ui}</AuthProvider>);
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("starts unauthenticated when no token in localStorage", async () => {
    authApi.getMe.mockRejectedValue(new Error("No token"));
    renderWithAuth(<AuthDisplay />);
    await waitFor(() =>
      expect(screen.getByTestId("authenticated")).toHaveTextContent("false")
    );
  });

  it("restores session when valid token exists in localStorage", async () => {
    localStorage.setItem("access_token", "valid-token");
    authApi.getMe.mockResolvedValue({
      id: 1,
      username: "alice",
      role: "user",
    });
    renderWithAuth(<AuthDisplay />);
    await waitFor(() =>
      expect(screen.getByTestId("username")).toHaveTextContent("alice")
    );
    expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
    expect(screen.getByTestId("admin")).toHaveTextContent("false");
  });

  it("sets isAdmin true when user role is admin", async () => {
    localStorage.setItem("access_token", "admin-token");
    authApi.getMe.mockResolvedValue({
      id: 2,
      username: "admin",
      role: "admin",
    });
    renderWithAuth(<AuthDisplay />);
    await waitFor(() =>
      expect(screen.getByTestId("admin")).toHaveTextContent("true")
    );
  });

  it("clears session when token is invalid on load", async () => {
    localStorage.setItem("access_token", "bad-token");
    authApi.getMe.mockRejectedValue(new Error("Unauthorized"));
    renderWithAuth(<AuthDisplay />);
    await waitFor(() =>
      expect(screen.getByTestId("authenticated")).toHaveTextContent("false")
    );
    expect(localStorage.getItem("access_token")).toBeNull();
  });
});
