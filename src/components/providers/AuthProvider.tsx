import { useEffect } from 'react'
import { useAuthStore } from '../../store/auth'

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
          // In a real app, you would decode the JWT or call a /me endpoint
          // For now, we'll just check if token exists and set a basic user
          const email = localStorage.getItem('user_email') || 'user@example.com'
          setUser({
            id: 'temp-id',
            email,
            name: email.split('@')[0],
          })
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        // Clear invalid tokens
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
