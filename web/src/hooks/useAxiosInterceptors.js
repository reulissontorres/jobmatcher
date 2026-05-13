import api, { setAuthToken } from '../services/apiClient'

export function setupAxiosInterceptors({ onUnauthenticated } = {}) {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) setAuthToken(token)
      return config
    },
    (error) => Promise.reject(error)
  )

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        if (typeof onUnauthenticated === 'function') onUnauthenticated()
      }
      return Promise.reject(error)
    }
  )
}
