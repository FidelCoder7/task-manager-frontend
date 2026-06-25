import { describe, it, expect, vi, beforeEach } from "vitest";
import client from "../api/client";
import { loginUser, registerUser, logoutUser, getMe } from "../api/authApi";

vi.mock("../api/client");

describe("authApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loginUser posts credentials and returns tokens", async () => {
    client.post.mockResolvedValue({
      data: { access_token: "abc", refresh_token: "xyz", token_type: "bearer" },
    });
    const result = await loginUser("alice@example.com", "Pass123!");
    expect(client.post).toHaveBeenCalledWith("/auth/login", {
      email: "alice@example.com",
      password: "Pass123!",
    });
    expect(result.access_token).toBe("abc");
  });

  it("registerUser posts user data", async () => {
    client.post.mockResolvedValue({
      data: { id: 1, email: "alice@example.com", username: "alice" },
    });
    const result = await registerUser("alice@example.com", "alice", "Pass123!");
    expect(client.post).toHaveBeenCalledWith("/auth/register", {
      email: "alice@example.com",
      username: "alice",
      password: "Pass123!",
    });
    expect(result.email).toBe("alice@example.com");
  });

  it("getMe returns user profile", async () => {
    client.get.mockResolvedValue({
      data: { id: 1, email: "alice@example.com", role: "user" },
    });
    const result = await getMe();
    expect(client.get).toHaveBeenCalledWith("/auth/me");
    expect(result.role).toBe("user");
  });

  it("logoutUser posts refresh token", async () => {
    client.post.mockResolvedValue({ data: { message: "Successfully logged out" } });
    await logoutUser("xyz");
    expect(client.post).toHaveBeenCalledWith("/auth/logout", {
      refresh_token: "xyz",
    });
  });
});
