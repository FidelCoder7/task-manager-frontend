import { describe, it, expect, vi, beforeEach } from "vitest";
import client from "../api/client";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskSummary,
} from "../api/tasksApi";

vi.mock("../api/client");

describe("tasksApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("getTasks calls correct endpoint with params", async () => {
    client.get.mockResolvedValue({
      data: { total: 1, page: 1, page_size: 10, items: [] },
    });
    const result = await getTasks({ page: 1, pageSize: 10, status: "pending" });
    expect(client.get).toHaveBeenCalledWith("/tasks/", {
      params: { page: 1, page_size: 10, status: "pending" },
    });
    expect(result.total).toBe(1);
  });

  it("getTasks omits empty filter params", async () => {
    client.get.mockResolvedValue({
      data: { total: 0, page: 1, page_size: 10, items: [] },
    });
    await getTasks({ page: 1, pageSize: 10, status: "", priority: "", search: "" });
    const call = client.get.mock.calls[0][1].params;
    expect(call).not.toHaveProperty("status");
    expect(call).not.toHaveProperty("priority");
    expect(call).not.toHaveProperty("search");
  });

  it("createTask posts task data", async () => {
    const task = { title: "Test", priority: "high", status: "pending" };
    client.post.mockResolvedValue({ data: { id: 1, ...task } });
    const result = await createTask(task);
    expect(client.post).toHaveBeenCalledWith("/tasks/", task);
    expect(result.id).toBe(1);
  });

  it("updateTask puts task data", async () => {
    client.put.mockResolvedValue({
      data: { id: 1, title: "Updated", status: "done" },
    });
    const result = await updateTask(1, { status: "done" });
    expect(client.put).toHaveBeenCalledWith("/tasks/1", { status: "done" });
    expect(result.status).toBe("done");
  });

  it("deleteTask calls delete endpoint", async () => {
    client.delete.mockResolvedValue({});
    await deleteTask(1);
    expect(client.delete).toHaveBeenCalledWith("/tasks/1");
  });

  it("getTaskSummary returns counts", async () => {
    client.get.mockResolvedValue({
      data: { total: 3, pending: 1, in_progress: 1, done: 1 },
    });
    const result = await getTaskSummary();
    expect(client.get).toHaveBeenCalledWith("/tasks/summary");
    expect(result.total).toBe(3);
  });
});
