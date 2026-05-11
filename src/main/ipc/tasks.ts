import { ipcMain } from "electron"
import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} from "../db/repos/tasksRepo"
import { assertString, assertBoolean, assertOneOf, assertNumber } from "./validate"
import type { TaskCreateInput, TaskUpdateInput, Priority } from "@shared/types"

export function registerTasksIpc(): void {
  ipcMain.handle("tasks:list", () => listTasks())

  ipcMain.handle("tasks:get", (_e, id: unknown) => {
    assertString(id, "id")
    return getTask(id)
  })

  ipcMain.handle("tasks:create", (_e, input: unknown) => {
    const { title, due_at, priority } = input as TaskCreateInput
    assertString(title, "title")
    if (due_at !== undefined && due_at !== null) assertNumber(due_at, "due_at")
    if (priority !== undefined) assertOneOf(priority, ["high", "medium", "low"] as const, "priority")
    return createTask({ title, due_at, priority })
  })

  ipcMain.handle("tasks:update", (_e, input: unknown) => {
    const { id, title, due_at, priority, is_done } = input as TaskUpdateInput
    assertString(id, "id")
    if (title !== undefined) assertString(title, "title")
    if (due_at !== undefined && due_at !== null) assertNumber(due_at, "due_at")
    if (priority !== undefined) assertOneOf(priority, ["high", "medium", "low"] as const, "priority")
    if (is_done !== undefined) assertBoolean(is_done, "is_done")
    return updateTask({ id, title, due_at, priority, is_done })
  })

  ipcMain.handle("tasks:delete", (_e, id: unknown) => {
    assertString(id, "id")
    deleteTask(id)
  })
}
