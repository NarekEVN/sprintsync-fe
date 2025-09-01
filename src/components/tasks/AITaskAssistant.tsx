import { useState } from 'react'
import { SparklesIcon } from '@heroicons/react/24/outline'

type AITaskAssistantProps = {
  isOpen: boolean
  onClose: () => void
}

export function AITaskAssistant({ isOpen, onClose }: AITaskAssistantProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
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

        <div className="p-6">
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              <SparklesIcon className="h-12 w-12 mx-auto text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">AI Features Coming Soon</h3>
            <p className="text-gray-600 text-sm">
              Advanced AI planning and optimization features are currently in development.
            </p>
            <p className="text-gray-600 text-sm mt-2">
              For now, you can use the AI description generation when creating new tasks.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Current AI Features</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• AI-powered task description generation</li>
              <li>• Smart suggestions based on task titles</li>
              <li>• Available in the "Create Task" modal</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
