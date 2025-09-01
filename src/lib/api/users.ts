import { api } from './client'

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  isAdmin: boolean
}

export type UpdateUserRequest = {
  firstName: string
  lastName: string
  email: string
}

export type CreateUserRequest = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export const usersApi = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/current-user')
    return response.data
  },

  updateUser: async (userId: string, updates: UpdateUserRequest): Promise<User> => {
    const response = await api.patch<User>(`/users/${userId}`, updates)
    return response.data
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}`)
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users')
    return response.data
  },
}
