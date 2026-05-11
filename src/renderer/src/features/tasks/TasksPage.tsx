import { useEffect } from "react"
import { useTasksStore } from "./store"
import { TasksList } from "./TasksList"

export default function TasksPage() {
  useEffect(() => {
    useTasksStore.getState().load()
  }, [])

  return (
    <div className="flex h-full flex-col">
      <TasksList />
    </div>
  )
}
