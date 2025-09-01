import { create } from 'zustand'
import { User, usersApi } from '../lib/api/users'

type UsersState = {
  users: User[]
  currentUser: User | null
  loading: boolean
  error: string | null
  fetchCurrentUser: () => Promise<void>
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>
  deleteUser: (userId: string) => Promise<void>
  setLoading: (loading: boolean) => void
  setError: (message: string | null) => void
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  currentUser: null,
  loading: false,
  error: null,

  fetchCurrentUser: async () => {
    set({ loading: true, error: null })
    try {
      const user = await usersApi.getCurrentUser()
      set({ currentUser: user })
    } catch (error) {
      set({ error: 'Failed to fetch current user' })
    } finally {
      set({ loading: false })
    }
  },

  updateUser: async (userId, updates) => {
    set({ loading: true, error: null })
    try {
      const updatedUser = await usersApi.updateUser(userId, {
        firstName: updates.firstName!,
        lastName: updates.lastName!,
        email: updates.email!,
      })
      
      // Update current user if it's the same user
      const { currentUser } = get()
      if (currentUser?.id === userId) {
        set({ currentUser: updatedUser })
      }
      
      // Update in users array if it exists
      set({
        users: get().users.map(user => 
          user.id === userId ? updatedUser : user
        )
      })
    } catch (error) {
      set({ error: 'Failed to update user' })
    } finally {
      set({ loading: false })
    }
  },

  deleteUser: async (userId) => {
    set({ loading: true, error: null })
    try {
      await usersApi.deleteUser(userId)
      set({
        users: get().users.filter(user => user.id !== userId)
      })
    } catch (error) {
      set({ error: 'Failed to delete user' })
    } finally {
      set({ loading: false })
    }
  },

  setLoading: (loading) => set({ loading }),
  setError: (message) => set({ error: message }),
}))
