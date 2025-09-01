import { create } from 'zustand'
import { Task, TaskStatus, tasksApi } from '../lib/api/tasks'

type TasksState = {
  tasks: Task[]
  loading: boolean
  error: string | null
  fetchTasks: () => Promise<void>
  createTask: (task: Omit<Task, 'id' | 'creator' | 'assignee' | 'totalMinutes' | 'createdAt' | 'updatedAt'>) => Promise<Task | null>
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  setLoading: (loading: boolean) => void
  setError: (message: string | null) => void
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null })
    try {
      const tasks = await tasksApi.getTasks()
      set({ tasks })
    } catch (error) {
      set({ error: 'Failed to fetch tasks' })
    } finally {
      set({ loading: false })
    }
  },

  createTask: async (taskData) => {
    set({ loading: true, error: null })
    try {
      const newTask = await tasksApi.createTask({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        assigneeId: taskData.assigneeId,
      })
      set({ tasks: [...get().tasks, newTask] })
      return newTask
    } catch (error) {
      set({ error: 'Failed to create task' })
      return null
    } finally {
      set({ loading: false })
    }
  },

  updateTaskStatus: async (taskId, status) => {
    set({ loading: true, error: null })
    try {
      const updatedTask = await tasksApi.updateTaskStatus(taskId, status)
      set({
        tasks: get().tasks.map(task => 
          task.id === taskId ? updatedTask : task
        )
      })
    } catch (error) {
      set({ error: 'Failed to update task status' })
    } finally {
      set({ loading: false })
    }
  },

  updateTask: async (taskId, updates) => {
    set({ loading: true, error: null })
    try {
      const updatedTask = await tasksApi.updateTask(taskId, updates)
      set({
        tasks: get().tasks.map(task => 
          task.id === taskId ? updatedTask : task
        )
      })
    } catch (error) {
      set({ error: 'Failed to update task' })
    } finally {
      set({ loading: false })
    }
  },

  deleteTask: async (taskId) => {
    set({ loading: true, error: null })
    try {
      // Note: Backend doesn't have delete endpoint, so we'll just remove from local state
      set({
        tasks: get().tasks.filter(task => task.id !== taskId)
      })
    } catch (error) {
      set({ error: 'Failed to delete task' })
    } finally {
      set({ loading: false })
    }
  },

  setLoading: (loading) => set({ loading }),
  setError: (message) => set({ error: message }),
}))
