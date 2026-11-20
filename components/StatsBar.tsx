'use client'

import { Job } from '@/lib/supabase'

export default function StatsBar({ jobs }: { jobs: Job[] }) {
  const total = jobs.length
  const scheduled = jobs.filter(j => j.status === 'scheduled').length
  const inProgress = jobs.filter(j => j.status === 'in_progress').length
  const completed = jobs.filter(j => j.status === 'completed').length
  const cancelled = jobs.filter(j => j.status === 'cancelled').length

  const stats = [
    { label: 'Total Jobs', value: total, color: 'text-gray-800' },
    { label: 'Scheduled', value: scheduled, color: 'text-blue-600' },
    { label: 'In Progress', value: inProgress, color: 'text-yellow-600' },
    { label: 'Completed', value: completed, color: 'text-green-600' },
    { label: 'Cancelled', value: cancelled, color: 'text-red-600' },
  ]

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {stats.map(stat => (
        <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4 text-center shadow-sm">
          <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
