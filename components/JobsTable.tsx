'use client'

import { Job } from '@/lib/supabase'
import StatusBadge from './StatusBadge'
import { MapPin, User, Calendar } from 'lucide-react'

interface Props {
  jobs: Job[]
  onStatusChange: (id: string, status: Job['status']) => void
}

export default function JobsTable({ jobs, onStatusChange }: Props) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg font-medium">No jobs found</p>
        <p className="text-sm mt-1">Try adjusting your filters or add a new job</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Technician</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Service</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Notes</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Update</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">
                <div className="font-medium text-gray-900">{job.customer_name}</div>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                  <MapPin size={11} />
                  {job.address}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-1 text-gray-700">
                  <User size={13} className="text-gray-400" />
                  {job.technician_name}
                </div>
              </td>
              <td className="py-3 px-4 text-gray-700">{job.service_type}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-1 text-gray-700">
                  <Calendar size={13} className="text-gray-400" />
                  {job.scheduled_date}
                </div>
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={job.status} />
              </td>
              <td className="py-3 px-4 text-gray-500 max-w-[180px] truncate">
                {job.notes ?? <span className="text-gray-300">—</span>}
              </td>
              <td className="py-3 px-4">
                <select
                  value={job.status}
                  onChange={e => onStatusChange(job.id, e.target.value as Job['status'])}
                  className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
