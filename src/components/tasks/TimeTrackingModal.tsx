import { useState, useEffect } from 'react'
import { XMarkIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { Task } from '../../lib/api/tasks'
import { useTasksStore } from '../../store/tasks'

type TimeTrackingModalProps = {
  task: Task
  isOpen: boolean
  onClose: () => void
}

export function TimeTrackingModal({ task, isOpen, onClose }: TimeTrackingModalProps) {
  const [minutes, setMinutes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { updateTaskTime } = useTasksStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!minutes) return

    const timeValue = parseInt(minutes)
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
    setMinutes('')
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
    const avgPerSession = currentTotal > 0 ? Math.round(currentTotal / Math.max(1, Math.ceil(currentTotal / 30))) : 0
    
    return {
      currentTotal,
      avgPerSession,
      suggestedTime: avgPerSession > 0 ? Math.round(avgPerSession * 1.2) : 30, // 20% more than average
      efficiency: currentTotal > 0 ? Math.round((currentTotal / (currentTotal + parseInt(minutes) || 0)) * 100) : 100
    }
  }

  const insights = getTimeInsights()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
              <span>Avg: {Math.floor(insights.avgPerSession / 60)}h {insights.avgPerSession % 60}m</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ChartBarIcon className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-blue-900">AI Insights</h4>
            </div>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Suggested time for this session: {Math.floor(insights.suggestedTime / 60)}h {insights.suggestedTime % 60}m</p>
              <p>• Current efficiency: {insights.efficiency}%</p>
              {insights.currentTotal > 0 && (
                <p>• You're on track with your time estimates</p>
              )}
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
                onChange={(e) => setMinutes(e.target.value)}
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
