import { useState, useEffect } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useTasksStore } from '../store/tasks'
import { TaskBoard } from '../components/tasks/TaskBoard'
import { CreateTaskModal } from '../components/tasks/CreateTaskModal'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ErrorMessage } from '../components/ui/ErrorMessage'

export function TasksPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { tasks, loading, error } = useTasksStore()
  const tasksStore = useTasksStore()

  useEffect(() => {
    tasksStore.fetchTasks()
  }, [])

  if (loading) {
    return <LoadingSpinner text="Loading tasks..." />
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Tasks</h2>
          <p className="text-gray-600 mt-1">Manage your project tasks and track progress</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            New Task
          </button>
        </div>
      </div>

      {error && (
        <ErrorMessage 
          message={error} 
          onDismiss={() => tasksStore.setError(null)}
        />
      )}

      <TaskBoard tasks={tasks} />

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </section>
  )
}
