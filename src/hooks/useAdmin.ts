import { useEffect } from 'react'
import { useAuth } from './useAuth'
import { useUsersStore } from '../store/users'

export function useAdmin() {
  const { user: authUser, isAuthenticated } = useAuth()
  const { currentUser, loading, error, fetchCurrentUser } = useUsersStore()

  useEffect(() => {
    if (isAuthenticated && !currentUser && !loading) {
      fetchCurrentUser()
    }
  }, [isAuthenticated, currentUser, loading, fetchCurrentUser])

  const isAdmin = currentUser?.isAdmin || false
  const user = currentUser || authUser

  return {
    user,
    isAdmin,
    loading,
    error,
    refreshUser: fetchCurrentUser,
  }
}
