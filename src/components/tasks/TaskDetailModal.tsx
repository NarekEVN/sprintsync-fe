import { useEffect, useState } from 'react'
import { XMarkIcon, ClockIcon, UserIcon, CalendarIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline'
import { Task, TaskStatus } from '../../lib/api/tasks'
import { User } from '../../lib/api/users'
import { usersApi } from '../../lib/api/users'
import { useTasksStore } from '../../store/tasks'

type TaskDetailModalProps = {
  task: Task | null
  isOpen: boolean
  onClose: () => void
}

export function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  const { updateTask } = useTasksStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedDescription, setEditedDescription] = useState('')
  const [editedStatus, setEditedStatus] = useState<TaskStatus>(TaskStatus.TODO)
  const [editedAssigneeId, setEditedAssigneeId] = useState('')
  const [editedTotalMinutes, setEditedTotalMinutes] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isEditing) {
          setIsEditing(false)
        } else {
          onClose()
        }
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, isEditing])

  // Initialize edit form when task changes
  useEffect(() => {
    if (task) {
      setEditedTitle(task.title)
      setEditedDescription(task.description || '')
      setEditedStatus(task.status)
      setEditedAssigneeId(task.assignee?.id || '')
      setEditedTotalMinutes(task.totalMinutes)
    }
  }, [task])

  // Load users for assignee dropdown
  useEffect(() => {
    if (isOpen && isEditing) {
      setIsLoadingUsers(true)
      usersApi.getAllUsers()
        .then(setUsers)
        .catch(console.error)
        .finally(() => setIsLoadingUsers(false))
    }
  }, [isOpen, isEditing])

  const handleSave = async () => {
    if (!task) return
    
    setIsSaving(true)
    try {
      await updateTask(task.id, {
        title: editedTitle,
        description: editedDescription,
        status: editedStatus,
        assigneeId: editedAssigneeId || null,
        totalMinutes: editedTotalMinutes
      })

      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update task:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (task) {
      setEditedTitle(task.title)
      setEditedDescription(task.description || '')
      setEditedStatus(task.status)
      setEditedAssigneeId(task.assignee?.id || '')
      setEditedTotalMinutes(task.totalMinutes)
    }
    setIsEditing(false)
  }

  if (!isOpen || !task) return null

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'bg-gray-100 text-gray-800'
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800'
      case TaskStatus.DONE:
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'To Do'
      case TaskStatus.IN_PROGRESS:
        return 'In Progress'
      case TaskStatus.DONE:
        return 'Done'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Task' : 'Task Details'}
          </h2>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-600 hover:text-indigo-700 transition-colors p-1"
                title="Edit task"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Task Title */}
          <div>
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full text-lg font-medium text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Task title"
                />
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <select
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value as TaskStatus)}
                    className="px-2 py-1 border border-gray-300 rounded-md text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={TaskStatus.TODO}>To Do</option>
                    <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                    <option value={TaskStatus.DONE}>Done</option>
                  </select>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{formatTime(task.totalMinutes)} logged</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{task.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                    {getStatusText(task.status)}
                  </span>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{formatTime(task.totalMinutes)} logged</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Task Description */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            {isEditing ? (
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full bg-gray-50 rounded-lg p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                rows={4}
                placeholder="Task description..."
              />
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{task.description || 'No description provided'}</p>
              </div>
            )}
          </div>

          {/* Task Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assignee */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <UserIcon className="h-4 w-4 text-gray-600" />
                <h4 className="font-medium text-gray-900">Assignee</h4>
              </div>
              {isEditing ? (
                <select
                  value={editedAssigneeId}
                  onChange={(e) => setEditedAssigneeId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={isLoadingUsers}
                >
                  <option value="">{isLoadingUsers ? 'Loading users...' : 'Unassigned'}</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-700">
                  {task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : 'Unassigned'}
                </p>
              )}
            </div>

            {/* Total Time Logged */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ClockIcon className="h-4 w-4 text-gray-600" />
                <h4 className="font-medium text-gray-900">Total Time Logged</h4>
              </div>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editedTotalMinutes}
                    onChange={(e) => setEditedTotalMinutes(parseInt(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    placeholder="Minutes"
                  />
                  <span className="text-sm text-gray-600">minutes</span>
                </div>
              ) : (
                <p className="text-gray-700">{formatTime(task.totalMinutes)}</p>
              )}
            </div>

            {/* Creator */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <UserIcon className="h-4 w-4 text-gray-600" />
                <h4 className="font-medium text-gray-900">Created By</h4>
              </div>
              <p className="text-gray-700">
                {task.creator ? `${task.creator.firstName} ${task.creator.lastName}` : 'Unknown'}
              </p>
            </div>

            {/* Created Date */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="h-4 w-4 text-gray-600" />
                <h4 className="font-medium text-gray-900">Created</h4>
              </div>
              <p className="text-gray-700">{formatDate(task.createdAt)}</p>
            </div>

            {/* Last Updated */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="h-4 w-4 text-gray-600" />
                <h4 className="font-medium text-gray-900">Last Updated</h4>
              </div>
              <p className="text-gray-700">{formatDate(task.updatedAt)}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !editedTitle.trim()}
                className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <CheckIcon className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
