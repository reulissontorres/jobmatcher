import api from './apiClient'

export async function apply({ candidateId, jobId }) {
  const res = await api.post('/applications/apply', { candidateId, jobId })
  return res.data
}

export async function getByJob(jobId) {
  const res = await api.get(`/applications/job/${jobId}`)
  return res.data
}

export async function getByCandidate(candidateId) {
  const res = await api.get(`/applications/candidate/${candidateId}`)
  return res.data
}
