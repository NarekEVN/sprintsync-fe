import { AppRouter } from './components/routing/Router'
import { AuthProvider } from './components/providers/AuthProvider'

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}
