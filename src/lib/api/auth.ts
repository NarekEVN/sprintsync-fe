import { api } from './client'

export type LoginRequest = {
  email: string
  password: string
}

export type AuthResponse = {
  accessToken: string
  refreshToken: string
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/refresh', { refreshToken })
    return response.data
  },
}
