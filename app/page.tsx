'use client'

import { useState, useMemo, useEffect } from 'react'
import { Plus, Search, Bug } from 'lucide-react'
import { supabase, Job } from '@/lib/supabase'
import StatsBar from '@/components/StatsBar'
import JobsTable from '@/components/JobsTable'
import AddJobModal from '@/components/AddJobModal'

type StatusFilter = Job['status'] | 'all'

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setJobs(data)
    setLoading(false)
  }

  const filtered = useMemo(() => {
    return jobs.filter(job => {
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        job.customer_name.toLowerCase().includes(q) ||
        job.technician_name.toLowerCase().includes(q) ||
        job.address.toLowerCase().includes(q) ||
        job.service_type.toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
  }, [jobs, statusFilter, search])

  const handleStatusChange = async (id: string, status: Job['status']) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j))
    await supabase.from('jobs').update({ status }).eq('id', id)
  }

  const handleAddJob = async (newJob: Omit<Job, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('jobs')
      .insert(newJob)
      .select()
      .single()
    if (!error && data) setJobs(prev => [data, ...prev])
  }

  const filterButtons: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bug className="text-green-600" size={22} />
            <span className="font-bold text-gray-900 text-lg">Moxie Field Tracker</span>
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              Internal
            </span>
          </div>
          <div className="text-sm text-gray-500">Operations Dashboard</div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage field technician jobs across all service types
          </p>
        </div>

        <StatsBar jobs={jobs} />

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-100">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search customer, technician, address..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {filterButtons.map(btn => (
                  <button
                    key={btn.value}
                    onClick={() => setStatusFilter(btn.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      statusFilter === btn.value
                        ? 'bg-green-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors ml-2"
              >
                <Plus size={14} />
                Add Job
              </button>
            </div>
          </div>

          <div className="p-2">
            {loading ? (
              <div className="text-center py-16 text-gray-400 text-sm">Loading jobs...</div>
            ) : (
              <JobsTable jobs={filtered} onStatusChange={handleStatusChange} />
            )}
          </div>

          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {jobs.length} jobs
            {statusFilter !== 'all' && ` · filtered by "${statusFilter}"`}
            {search && ` · search: "${search}"`}
          </div>
        </div>
      </main>

      {showModal && (
        <AddJobModal onClose={() => setShowModal(false)} onAdd={handleAddJob} />
      )}
    </div>
  )
}