import { create } from 'zustand'

export type Task = {
  _id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  assigneeId?: string
  timeLoggedMinutes?: number
}

type TasksState = {
  tasks: Task[]
  loading: boolean
  error: string | null
  setTasks: (tasks: Task[]) => void
  setLoading: (loading: boolean) => void
  setError: (message: string | null) => void
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  loading: false,
  error: null,
  setTasks: (tasks) => set({ tasks }),
  setLoading: (loading) => set({ loading }),
  setError: (message) => set({ error: message }),
}))
