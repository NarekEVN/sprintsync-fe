import { useEffect } from 'react'
import { useAuthStore } from '../../store/auth'
import { usersApi } from "../../lib/api/users";

type AuthProviderProps = {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true)
      
      try {
        const token = localStorage.getItem('access_token')
        if (token) {
          const currentUser = await usersApi.getCurrentUser()

          setUser({
            id: currentUser.id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            isAdmin: currentUser.isAdmin,
          })
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_email')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [setUser, setLoading])

  return <>{children}</>
}
