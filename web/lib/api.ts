const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5297').replace(/\/$/, '')

async function parseError(res: Response) {
  let data: any = null
  try {
    data = await res.json()
  } catch (e) {
    data = null
  }

  if (data && data.errors) {
    const errs = data.errors
    if (Array.isArray(errs)) return errs.join(', ')
    if (typeof errs === 'object') {
      try {
        const vals = Object.values(errs).flat()
        return vals.join(', ')
      } catch (e) {
        return JSON.stringify(errs)
      }
    }
    return String(errs)
  }

  if (data && (data.message || data.title)) return data.message || data.title
  return res.statusText || `HTTP ${res.status}`
}

async function parseResponse(res: Response) {
  if (res.status === 204) return null
  try {
    return await res.json()
  } catch (e) {
    return null
  }
}

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}/api/${path}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  }

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('jobmatcher_token')
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    const message = await parseError(res)
    throw new Error(message || `Request failed with status ${res.status}`)
  }

  return parseResponse(res)
}

export async function authLogin(email: string, password: string) {
  return request('Auth/login', {
    method: 'POST',
    body: JSON.stringify({ Email: email, Password: password })
  })
}

export async function authRegister(FullName: string, Email: string, Password: string, CompanyName?: string) {
  return request('Auth/register', {
    method: 'POST',
    body: JSON.stringify({ FullName, Email, Password, CompanyName })
  })
}

export default { authLogin, authRegister }
