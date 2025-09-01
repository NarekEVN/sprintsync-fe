import { useCallback } from 'react'
import { useAuthStore } from '../store/auth'
import { authApi } from '../lib/api/auth'
import { AxiosError } from 'axios'

export function useAuth() {
  const { user, loading, error, setUser, setLoading, setError, logout } = useAuthStore()

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authApi.login({ email, password })
      
      // Store tokens
      localStorage.setItem('access_token', response.accessToken)
      localStorage.setItem('refresh_token', response.refreshToken)
      localStorage.setItem('user_email', email) // Store for auth initialization
      
      // For now, we'll decode user info from token or make a separate call
      // This is a simplified approach - in production you'd decode JWT or call /me endpoint
      setUser({
        id: 'temp-id', // Would come from JWT decode or /me endpoint
        email,
        name: email.split('@')[0], // Temporary - should come from backend
      })
      
      return true
    } catch (err) {
      const error = err as AxiosError
      setError(error.response?.data?.message || 'Login failed')
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
