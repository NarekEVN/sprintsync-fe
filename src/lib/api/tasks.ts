import { api } from './client'
import { User } from "./users";

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export type CreateTaskRequest = {
  title: string
  description?: string
  status: TaskStatus
  assigneeId?: string
}

export type UpdateTaskRequest = {
  title?: string
  description?: string
  status?: TaskStatus
  assigneeId?: string
}

export type UpdateTaskStatusRequest = {
  status: TaskStatus
}

export type UpdateTaskAssigneeRequest = {
  assigneeId: string
}

export type UpdateTaskTimeRequest = {
  minutes: number
}

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  creator: User
  assignee: User | null
  totalMinutes: number
  createdAt: string
  updatedAt: string
}

export const tasksApi = {
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks')
    return response.data
  },

  createTask: async (task: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<Task>('/tasks', task)
    return response.data
  },

  updateTask: async (taskId: string, updates: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${taskId}`, updates)
    return response.data
  },

  updateTaskStatus: async (taskId: string, status: TaskStatus): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${taskId}/status`, { status })
    return response.data
  },

  updateTaskAssignee: async (taskId: string, assigneeId: string): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${taskId}/assignee`, { assigneeId })
    return response.data
  },

  updateTaskTime: async (taskId: string, minutes: number): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${taskId}/time`, { minutes })
    return response.data
  },

  suggestDescription: async (title: string): Promise<string> => {
    const response = await api.post<{ description: string }>('/tasks/ai/suggest', { title })
    return response.data.description
  },
}
