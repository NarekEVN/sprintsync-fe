import { useCallback } from 'react'
import { useAuthStore } from '../store/auth'
import { authApi } from '../lib/api/auth'
import {usersApi} from "../lib/api/users";

export function useAuth() {
  const { user, loading, error, setUser, setLoading, setError, logout } = useAuthStore()

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authApi.login({ email, password })
      
      localStorage.setItem('access_token', response.accessToken)
      localStorage.setItem('refresh_token', response.refreshToken)
      localStorage.setItem('user_email', email)

      const currentUser = await usersApi.getCurrentUser()

      setUser({
        id: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        isAdmin: currentUser.isAdmin,
      })
      
      return true
    } catch (err) {
      setError('Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }, [setUser, setLoading, setError])

  const isAuthenticated = !!user

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
  }
}
