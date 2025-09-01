import { useEffect } from 'react'
import { useAdmin } from '../hooks/useAdmin'
import { useTasksStore } from '../store/tasks'
import { useUsersStore } from '../store/users'
import { UserProfile } from '../components/admin/UserProfile'
import { UsersList } from '../components/admin/UsersList'
import { useTaskStats } from '../hooks/useTaskStats'
import { UsersIcon, ClipboardDocumentListIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ErrorMessage } from '../components/ui/ErrorMessage'

export function AdminPage() {
  const { user, isAdmin, loading } = useAdmin()
  const { tasks, error: tasksError } = useTasksStore()
  const { users, error: usersError } = useUsersStore()
  const tasksStore = useTasksStore()
  const usersStore = useUsersStore()

  useEffect(() => {
    tasksStore.fetchTasks()
    usersStore.fetchAllUsers()
  }, [])

  if (loading) {
    return <LoadingSpinner text="Loading admin panel..." />
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <UsersIcon className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">You need administrator privileges to access this page.</p>
      </div>
    )
  }

  const stats = useTaskStats(tasks)

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600 mt-1">Manage users and monitor system activity</p>
      </div>

      {tasksError && (
        <ErrorMessage 
          message={tasksError} 
          onDismiss={() => tasksStore.setError(null)}
        />
      )}
      {usersError && (
        <ErrorMessage 
          message={usersError} 
          onDismiss={() => usersStore.setError(null)}
        />
      )}

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.done}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.floor(stats.totalTime / 60)}h
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Profile</h3>
          {user && 'firstName' in user && <UserProfile user={user} canEdit={true} />}
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Management</h3>
          <UsersList users={users} />
        </div>
      </div>
    </section>
  )
}
