import type { Config } from '@netlify/functions'
import { createServerClient, getUserFromRequest, jsonError } from './_shared/supabase'

export default async function(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user) return jsonError('Unauthorized', 401)

  const supabase = createServerClient()

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', user.id)
      .order('name')
    if (error) return jsonError(error.message, 500)
    return Response.json(data)
  }

  if (req.method === 'POST') {
    const body = await req.json()
    const name = body.name?.trim()
    if (!name) return jsonError('name is required', 400)

    await supabase.from('profiles').upsert({ id: user.id }, { onConflict: 'id' })

    const { data, error } = await supabase
      .from('tags')
      .insert({ user_id: user.id, name })
      .select()
      .single()
    if (error) {
      if (error.code === '23505') return jsonError('A tag with that name already exists', 409)
      return jsonError(error.message, 500)
    }
    return Response.json(data, { status: 201 })
  }

  return jsonError('Method not allowed', 405)
}

export const config: Config = { path: '/api/tags' }
