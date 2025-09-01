import { Task, TaskStatus } from '../../lib/api/tasks'
import { TaskCard } from './TaskCard'

type TaskBoardProps = {
  tasks: Task[]
}

const columns = [
  { status: TaskStatus.TODO, title: 'To Do', color: 'bg-gray-50' },
  { status: TaskStatus.IN_PROGRESS, title: 'In Progress', color: 'bg-blue-50' },
  { status: TaskStatus.DONE, title: 'Done', color: 'bg-green-50' },
]

export function TaskBoard({ tasks }: TaskBoardProps) {
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map(({ status, title, color }) => {
        const columnTasks = getTasksByStatus(status)
        
        return (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <span className="px-2 py-1 text-xs font-medium bg-white rounded-full text-gray-600">
                {columnTasks.length}
              </span>
            </div>
            
            <div className={`${color} rounded-lg p-4 min-h-[400px]`}>
              {columnTasks.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-sm">No tasks</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {columnTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
