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
    const response = await api.get<User>('/users/current-users')
    return response.data
  },

  updateUser: async (userId: string, updates: UpdateUserRequest): Promise<User> => {
    const response = await api.patch<User>(`/users/${userId}`, updates)
    return response.data
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}`)
  },

  // Note: These endpoints are not available in the backend yet
  // getAllUsers: async (): Promise<User[]> => {
  //   const response = await api.get<User[]>('/users')
  //   return response.data
  // },

  // createUser: async (user: CreateUserRequest): Promise<User> => {
  //   const response = await api.post<User>('/users', user)
  //   return response.data
  // },
}
