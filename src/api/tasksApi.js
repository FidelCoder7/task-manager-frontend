/**
 * Task-related API calls.
 *
 * All calls go through the shared client (JWT attached automatically).
 * Admin calls are included here since they're still task/user data —
 * just unscoped.
 */

import client from "./client";

// ── Tasks ────────────────────────────────────────────────────────

export async function getTasks({ page = 1, pageSize = 10, status = "", priority = "", search = "" } = {}) {
  const response = await client.get("/tasks/", {
    params: {
      page,
      page_size: pageSize,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(search && { search }),
    },
  });
  return response.data; // { total, page, page_size, items }
}

export async function createTask(data) {
  const response = await client.post("/tasks/", data);
  return response.data;
}

export async function updateTask(id, data) {
  const response = await client.put(`/tasks/${id}`, data);
  return response.data;
}

export async function deleteTask(id) {
  await client.delete(`/tasks/${id}`);
}

export async function getTaskSummary() {
  const response = await client.get("/tasks/summary");
  return response.data; // { total, pending, in_progress, done }
}

// ── Admin ────────────────────────────────────────────────────────

export async function getAllTasks({ page = 1, pageSize = 20 } = {}) {
  const response = await client.get("/admin/tasks", {
    params: { page, page_size: pageSize },
  });
  return response.data;
}

export async function getAllUsers() {
  const response = await client.get("/admin/users");
  return response.data;
}