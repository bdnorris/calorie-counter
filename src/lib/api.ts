import { supabase } from './supabase'

async function getAuthHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(url: string, options: RequestInit = {}): Promise<Response> {
  const authHeader = await getAuthHeader()
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...(options.headers as Record<string, string> ?? {}),
    },
  })
  return res
}

export const api = {
  get: (url: string) => request(url),
  post: (url: string, body: unknown) =>
    request(url, { method: 'POST', body: JSON.stringify(body) }),
  put: (url: string, body: unknown) =>
    request(url, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (url: string) => request(url, { method: 'DELETE' }),
}
