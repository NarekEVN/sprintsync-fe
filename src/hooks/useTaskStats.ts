import { useMemo } from 'react'
import { Task, TaskStatus } from '../lib/api/tasks'

export function useTaskStats(tasks: Task[]) {
  return useMemo(() => {
    const total = tasks.length
    const todo = tasks.filter(t => t.status === TaskStatus.TODO).length
    const inProgress = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length
    const done = tasks.filter(t => t.status === TaskStatus.DONE).length
    const totalTime = tasks.reduce((sum, t) => sum + t.totalMinutes, 0)
    
    return { total, todo, inProgress, done, totalTime }
  }, [tasks])
}
