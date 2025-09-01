import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from '../../layouts/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminRoute } from './AdminRoute'
import { DashboardPage } from '../../pages/DashboardPage'
import { TasksPage } from '../../pages/TasksPage'
import { LoginPage } from '../../pages/LoginPage'
import { AdminPage } from '../../pages/AdminPage'
import { NotFoundPage } from '../../pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'tasks', element: <TasksPage /> },
      { 
        path: 'admin', 
        element: (
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        ) 
      },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '*', element: <NotFoundPage /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
