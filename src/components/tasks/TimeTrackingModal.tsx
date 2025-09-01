import { useState, useEffect } from 'react'
import { XMarkIcon, ClockIcon } from '@heroicons/react/24/outline'
import { Task } from '../../lib/api/tasks'
import { useTasksStore } from '../../store/tasks'

type TimeTrackingModalProps = {
  task: Task
  isOpen: boolean
  onClose: () => void
}

export function TimeTrackingModal({ task, isOpen, onClose }: TimeTrackingModalProps) {
  const [minutes, setMinutes] = useState<number>(task.totalMinutes || 0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { updateTaskTime } = useTasksStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!minutes) return

    const timeValue = minutes
    if (isNaN(timeValue) || timeValue <= 0) return

    setIsSubmitting(true)
    try {
      await updateTaskTime(task.id, timeValue)
      handleClose()
    } catch (error) {
      console.error('Failed to update time:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setMinutes(0)
    onClose()
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const getTimeInsights = () => {
    const currentTotal = task.totalMinutes

    return {
      currentTotal,
    }
  }

  const insights = getTimeInsights()

  if (!isOpen) return null

  return (
    <div onClick={event => event.stopPropagation()} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-6 w-6 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Time Tracking</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">{task.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Total: {Math.floor(insights.currentTotal / 60)}h {insights.currentTotal % 60}m</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-1">
                Time Spent (minutes) *
              </label>
              <input
                type="number"
                id="minutes"
                value={minutes}
                onChange={(e) => setMinutes(+e.target.value)}
                min="1"
                max="480"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter minutes spent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter time in minutes (1-480 minutes, or 8 hours max)
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!minutes || isSubmitting}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Saving...' : 'Save Time Entry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
