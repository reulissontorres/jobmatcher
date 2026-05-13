import api from './apiClient'

export async function runForJob(jobId) {
  const res = await api.post(`/matching/job/${jobId}/run`)
  return res.data
}

export async function runForCandidate(candidateId) {
  const res = await api.post(`/matching/candidate/${candidateId}/run`)
  return res.data
}
