import api from './apiClient'

export async function getJobs(params) {
  const res = await api.get('/jobs', { params })
  return res.data
}

export async function getJobById(id) {
  const res = await api.get(`/jobs/${id}`)
  return res.data
}

export async function createJob(payload) {
  const res = await api.post('/jobs', payload)
  return res.data
}

export async function updateJob(id, payload) {
  const res = await api.put(`/jobs/${id}`, payload)
  return res.data
}

export async function deleteJob(id) {
  const res = await api.delete(`/jobs/${id}`)
  return res.data
}
