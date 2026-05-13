import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getJobById } from '../../services/jobService'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function JobDetails() {
  const { id } = useParams()
  const { data, isLoading, error } = useQuery(['job', id], () => getJobById(id), { enabled: !!id })

  if (isLoading) return <LoadingSpinner />
  if (error) return <div className="text-red-600">Erro ao carregar vaga</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{data?.title}</h2>
      <div className="text-sm text-gray-600 mb-4">{data?.companyName}</div>
      <div className="prose max-w-none">{data?.description}</div>
    </div>
  )
}
