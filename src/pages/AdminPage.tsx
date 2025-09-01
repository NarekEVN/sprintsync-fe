import { useEffect } from 'react'
import { useAdmin } from '../hooks/useAdmin'
import { useTasksStore } from '../store/tasks'
import { UserProfile } from '../components/admin/UserProfile'
import { TaskStatus } from '../lib/api/tasks'
import { UsersIcon, ClipboardDocumentListIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export function AdminPage() {
  const { user, isAdmin, loading } = useAdmin()
  const { tasks, fetchTasks } = useTasksStore()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
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

  const getTaskStats = () => {
    const total = tasks.length
    const todo = tasks.filter(t => t.status === TaskStatus.TODO).length
    const inProgress = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length
    const done = tasks.filter(t => t.status === TaskStatus.DONE).length
    const totalTime = tasks.reduce((sum, t) => sum + t.totalMinutes, 0)
    
    return { total, todo, inProgress, done, totalTime }
  }

  const stats = getTaskStats()

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600 mt-1">Manage users and monitor system activity</p>
      </div>

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

      {/* User Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current User Profile */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Profile</h3>
          {user && <UserProfile user={user} canEdit={true} />}
        </div>

        {/* Admin Tools */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Admin Tools</h3>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-3">User Management</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span>List All Users</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span>Create New Users</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span>Manage User Roles</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Delete Users</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Available</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-medium text-orange-900 mb-2">⚠️ Backend Requirements</h4>
            <div className="text-sm text-orange-800 space-y-1">
              <p>To enable full admin functionality, the following backend endpoints are needed:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><code>GET /users</code> - List all users</li>
                <li><code>POST /users</code> - Create new user (admin only)</li>
                <li><code>PATCH /users/:id/role</code> - Update user role</li>
                <li><code>GET /admin/analytics</code> - System analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
