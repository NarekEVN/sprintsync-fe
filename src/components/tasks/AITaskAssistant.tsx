import { useState } from 'react'
import { SparklesIcon, LightBulbIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useTasksStore } from '../../store/tasks'
import { TaskStatus } from '../../lib/api/tasks'

type AITaskAssistantProps = {
  onClose: () => void
}

export function AITaskAssistant({ onClose }: AITaskAssistantProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const { tasks } = useTasksStore()

  const generateDailyPlan = async () => {
    setIsGenerating(true)
    try {
      // Analyze current tasks and generate suggestions
      const todoTasks = tasks.filter(t => t.status === TaskStatus.TODO)
      const inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS)
      
      let plan = []
      
      if (todoTasks.length > 0) {
        plan.push(`📋 **Priority Tasks for Today:**`)
        plan.push(`• Focus on completing: ${todoTasks.slice(0, 3).map(t => t.title).join(', ')}`)
        
        if (todoTasks.length > 3) {
          plan.push(`• Consider breaking down larger tasks into smaller subtasks`)
        }
      }
      
      if (inProgressTasks.length > 0) {
        plan.push(`\n🔄 **Tasks in Progress:**`)
        plan.push(`• Continue working on: ${inProgressTasks.map(t => t.title).join(', ')}`)
        plan.push(`• Set time blocks for focused work sessions`)
      }
      
      if (todoTasks.length === 0 && inProgressTasks.length === 0) {
        plan.push(`🎉 **Great job!** All tasks are completed.`)
        plan.push(`• Consider adding new tasks or reviewing completed work`)
        plan.push(`• Plan for upcoming sprints or projects`)
      }
      
      // Time management suggestions
      const totalTime = tasks.reduce((sum, t) => sum + t.totalMinutes, 0)
      if (totalTime > 0) {
        plan.push(`\n⏰ **Time Management Tips:**`)
        plan.push(`• Total time logged: ${Math.floor(totalTime / 60)}h ${totalTime % 60}m`)
        plan.push(`• Use Pomodoro technique for focused work`)
        plan.push(`• Take regular breaks every 25-30 minutes`)
      }
      
      setSuggestions(plan)
    } catch (error) {
      setSuggestions(['❌ Failed to generate suggestions. Please try again.'])
    } finally {
      setIsGenerating(false)
    }
  }

  const generateTaskOptimization = async () => {
    setIsGenerating(true)
    try {
      const optimizations = []
      
      // Analyze task distribution
      const todoCount = tasks.filter(t => t.status === TaskStatus.TODO).length
      const inProgressCount = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length
      const doneCount = tasks.filter(t => t.status === TaskStatus.DONE).length
      
      if (todoCount > 5) {
        optimizations.push(`📊 **Task Queue Management:**`)
        optimizations.push(`• You have ${todoCount} tasks in your queue`)
        optimizations.push(`• Consider prioritizing the top 3 most important tasks`)
        optimizations.push(`• Break down large tasks into smaller, manageable pieces`)
      }
      
      if (inProgressCount > 3) {
        optimizations.push(`\n⚡ **Work in Progress:**`)
        optimizations.push(`• You're working on ${inProgressCount} tasks simultaneously`)
        optimizations.push(`• Focus on completing 1-2 tasks before starting new ones`)
        optimizations.push(`• This will improve your completion rate`)
      }
      
      if (doneCount > 0) {
        optimizations.push(`\n🎯 **Productivity Insights:**`)
        optimizations.push(`• You've completed ${doneCount} tasks`)
        optimizations.push(`• Review what worked well and apply those patterns`)
        optimizations.push(`• Celebrate your progress!`)
      }
      
      // Time optimization
      const avgTimePerTask = tasks.length > 0 ? tasks.reduce((sum, t) => sum + t.totalMinutes, 0) / tasks.length : 0
      if (avgTimePerTask > 0) {
        optimizations.push(`\n⏱️ **Time Optimization:**`)
        optimizations.push(`• Average time per task: ${Math.floor(avgTimePerTask / 60)}h ${Math.round(avgTimePerTask % 60)}m`)
        optimizations.push(`• Use time tracking to identify bottlenecks`)
        optimizations.push(`• Set realistic time estimates for future tasks`)
      }
      
      setSuggestions(optimizations)
    } catch (error) {
      setSuggestions(['❌ Failed to generate optimizations. Please try again.'])
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-6 w-6 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">AI Task Assistant</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={generateDailyPlan}
              disabled={isGenerating}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <LightBulbIcon className="h-6 w-6 text-yellow-600" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Daily Planning</h3>
                <p className="text-sm text-gray-600">Get AI-powered daily task recommendations</p>
              </div>
            </button>
            
            <button
              onClick={generateTaskOptimization}
              disabled={isGenerating}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ClockIcon className="h-6 w-6 text-blue-600" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Task Optimization</h3>
                <p className="text-sm text-gray-600">Analyze and optimize your workflow</p>
              </div>
            </button>
          </div>

          {/* Loading State */}
          {isGenerating && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Generating AI suggestions...</p>
            </div>
          )}

          {/* Suggestions Display */}
          {suggestions.length > 0 && !isGenerating && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">AI Suggestions</h3>
              <div className="space-y-2 text-sm text-gray-700">
                {suggestions.map((suggestion, index) => (
                  <p key={index} className="whitespace-pre-line">{suggestion}</p>
                ))}
              </div>
            </div>
          )}

          {/* Quick Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">💡 Quick Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use the AI assistant to plan your day efficiently</li>
              <li>• Review suggestions regularly to optimize your workflow</li>
              <li>• Combine AI insights with your own judgment</li>
              <li>• Track your progress to see improvements over time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
