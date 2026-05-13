import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getJobs } from '../../services/jobService'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { Link } from 'react-router-dom'

export default function JobsList() {
  const { data, isLoading, error } = useQuery(['jobs'], () => getJobs())

  if (isLoading) return <LoadingSpinner />
  if (error) return <div className="text-red-600">Erro ao carregar vagas</div>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Vagas</h2>
      <ul className="space-y-3">
        {data?.map((job) => (
          <li key={job.id} className="p-4 bg-white shadow rounded">
            <Link to={`/jobs/${job.id}`} className="font-medium text-indigo-600">{job.title}</Link>
            <div className="text-sm text-gray-600">{job.companyName}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
