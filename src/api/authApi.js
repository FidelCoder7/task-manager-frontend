/**
 * Auth-related API calls.
 *
 * Thin wrappers around the backend's /auth/* endpoints.
 * No token logic here — that's handled by the shared client interceptor.
 */

import client from "./client";

export async function registerUser(email, username, password) {
  const response = await client.post("/auth/register", {
    email,
    username,
    password,
  });
  return response.data;
}

export async function loginUser(email, password) {
  const response = await client.post("/auth/login", { email, password });
  return response.data; // { access_token, refresh_token, token_type }
}

export async function getMe() {
  const response = await client.get("/auth/me");
  return response.data; // { id, email, username, role, ... }
}

export async function logoutUser(refreshToken) {
  const response = await client.post("/auth/logout", {
    refresh_token: refreshToken,
  });
  return response.data;
}
