'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Job } from '@/lib/supabase'

type NewJob = Omit<Job, 'id' | 'created_at'>

interface Props {
  onClose: () => void
  onAdd: (job: NewJob) => void
}

const SERVICE_TYPES = [
  'General Pest Control',
  'Termite Inspection',
  'Mosquito Treatment',
  'Rodent Exclusion',
  'Lawn Care',
  'Attic Insulation',
]

export default function AddJobModal({ onClose, onAdd }: Props) {
  const [form, setForm] = useState<NewJob>({
    technician_name: '',
    customer_name: '',
    address: '',
    service_type: 'General Pest Control',
    status: 'scheduled',
    scheduled_date: new Date().toISOString().split('T')[0],
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({ ...form, notes: form.notes || null })
    onClose()
  }

  const field = (
    label: string,
    key: keyof NewJob,
    type = 'text',
    required = true
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        required={required}
        value={(form[key] as string) ?? ''}
        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Add New Job</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {field('Customer Name', 'customer_name')}
          {field('Address', 'address')}
          {field('Technician Name', 'technician_name')}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
            <select
              value={form.service_type}
              onChange={e => setForm(prev => ({ ...prev, service_type: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={e => setForm(prev => ({ ...prev, status: e.target.value as Job['status'] }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {field('Scheduled Date', 'scheduled_date', 'date')}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea
              value={form.notes ?? ''}
              onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Add Job
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
