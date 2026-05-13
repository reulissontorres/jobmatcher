import api from './apiClient'

export async function getCandidates(params) {
  const res = await api.get('/candidates', { params })
  return res.data
}

export async function getCandidateById(id) {
  const res = await api.get(`/candidates/${id}`)
  return res.data
}

export async function createCandidate(payload) {
  const res = await api.post('/candidates', payload)
  return res.data
}

export async function updateCandidate(id, payload) {
  const res = await api.put(`/candidates/${id}`, payload)
  return res.data
}

export async function deleteCandidate(id) {
  const res = await api.delete(`/candidates/${id}`)
  return res.data
}
