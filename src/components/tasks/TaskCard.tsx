import { useState } from 'react'
import { Task, TaskStatus } from '../../lib/api/tasks'
import { useTasksStore } from '../../store/tasks'
import { ClockIcon, UserIcon } from '@heroicons/react/24/outline'
import { TimeTrackingModal } from './TimeTrackingModal'

type TaskCardProps = {
  task: Task
}

const statusColors = {
  [TaskStatus.TODO]: 'bg-gray-100 text-gray-800',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [TaskStatus.DONE]: 'bg-green-100 text-green-800',
}

const statusLabels = {
  [TaskStatus.TODO]: 'To Do',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.DONE]: 'Done',
}

export function TaskCard({ task }: TaskCardProps) {
  const { updateTaskStatus } = useTasksStore()
  const [isTimeTrackingOpen, setIsTimeTrackingOpen] = useState(false)

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (newStatus !== task.status) {
      updateTaskStatus(task.id, newStatus)
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-gray-900 text-sm leading-tight">{task.title}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status]}`}>
          {statusLabels[task.status]}
        </span>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <ClockIcon className="h-3 w-3" />
          <span>{formatTime(task.totalMinutes)}</span>
        </div>
        
        {task.assignee && (
          <div className="flex items-center gap-1">
            <UserIcon className="h-3 w-3" />
            <span>{task.assignee.firstName}</span>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => setIsTimeTrackingOpen(true)}
          className="text-xs px-2 py-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
        >
          Track Time
        </button>
        
        {task.status !== TaskStatus.TODO && (
          <button
            onClick={() => handleStatusChange(TaskStatus.TODO)}
            className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            Move to To Do
          </button>
        )}
        
        {task.status !== TaskStatus.IN_PROGRESS && (
          <button
            onClick={() => handleStatusChange(TaskStatus.IN_PROGRESS)}
            className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            Start
          </button>
        )}
        
        {task.status !== TaskStatus.DONE && (
          <button
            onClick={() => handleStatusChange(TaskStatus.DONE)}
            className="text-xs px-2 py-1 text-green-600 hover:bg-green-50 rounded transition-colors"
          >
            Complete
          </button>
        )}
      </div>

      <TimeTrackingModal
        task={task}
        isOpen={isTimeTrackingOpen}
        onClose={() => setIsTimeTrackingOpen(false)}
      />
    </div>
  )
}
