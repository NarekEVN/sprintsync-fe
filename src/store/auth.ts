import { create } from 'zustand'

export type AuthUser = {
  id: string
  email: string
  name?: string
  role?: 'user' | 'admin'
}

type AuthState = {
  user: AuthUser | null
  loading: boolean
  error: string | null
  setUser: (user: AuthUser | null) => void
  setLoading: (loading: boolean) => void
  setError: (message: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (message) => set({ error: message }),
  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_email')
    set({ user: null })
  },
}))
